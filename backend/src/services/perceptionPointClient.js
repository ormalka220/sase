class PerceptionPointClient {
  constructor() {
    this.apiEnabled = process.env.PP_API_ENABLED === 'true'
    this.baseUrl = (process.env.PP_BASE_URL || 'https://api.eu.perception-point.io').replace(/\/$/, '')
    this.token = process.env.PP_API_TOKEN || ''
  }

  async request(path, options = {}) {
    if (!this.apiEnabled || !this.token) {
      throw new Error('Perception Point API is disabled or token is missing')
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: options.method || 'GET',
      headers: {
        Authorization: `Token ${this.token}`,
        'Content-Type': options.contentType || 'application/json',
      },
      body: options.body,
    })

    if (!response.ok) {
      const rawDetails = await response.text()
      const cleanDetails = this.sanitizeErrorDetails(rawDetails)
      // Keep full upstream payload in server logs for debugging.
      console.error('[PerceptionPointClient] upstream error', {
        status: response.status,
        path,
        details: rawDetails,
      })
      throw new Error(`Perception Point API error (${response.status}): ${cleanDetails}`)
    }

    if (response.status === 204) return null
    return response.json()
  }

  sanitizeErrorDetails(raw) {
    if (!raw) return 'Unknown upstream error'
    const trimmed = String(raw).trim()
    // Try JSON error payload first.
    try {
      const parsed = JSON.parse(trimmed)
      if (typeof parsed === 'string') return parsed
      if (parsed?.error) return String(parsed.error)
      if (parsed?.message) return String(parsed.message)
      // Handle validation payloads like: { "email": ["..."] }
      if (parsed && typeof parsed === 'object') {
        const firstKey = Object.keys(parsed)[0]
        const value = firstKey ? parsed[firstKey] : null
        if (Array.isArray(value) && value.length > 0) {
          return `${firstKey}: ${String(value[0])}`
        }
        if (typeof value === 'string' && value.trim()) {
          return `${firstKey}: ${value}`
        }
      }
      return 'Upstream service error'
    } catch {
      // not JSON
    }

    // Strip HTML and normalize whitespace for user-facing messages.
    const noHtml = trimmed.replace(/<[^>]+>/g, ' ')
    const normalized = noHtml.replace(/\s+/g, ' ').trim()
    if (!normalized) return 'Upstream service error'
    return normalized.length > 220 ? `${normalized.slice(0, 220)}...` : normalized
  }

  async createOrganization({ companyName, domain, seats, adminEmail }) {
    if (!this.apiEnabled) {
      return {
        orgId: `pp-org-${Date.now()}`,
        orgName: companyName,
        region: 'eu-central',
        domain,
      }
    }

    const payload = {
      name: companyName,
      active: true,
      number_of_seats: seats,
      origins: { office365: true },
      email_report_recipients: adminEmail,
      client_alert_admin_email_addresses: adminEmail,
    }

    let result
    try {
      result = await this.request('/api/organizations/', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    } catch (err) {
      const msg = String(err?.message || '')
      // Idempotency: org already exists in PP, reuse it instead of failing provisioning.
      if (msg.includes('organization with this name already exists')) {
        const orgs = await this.request('/api/organizations/')
        const list = Array.isArray(orgs?.results) ? orgs.results : Array.isArray(orgs) ? orgs : []
        const existing = list.find((o) => String(o?.name || '').trim().toLowerCase() === String(companyName).trim().toLowerCase())
        if (existing) {
          return {
            orgId: String(existing.id),
            orgName: existing.name || companyName,
            region: 'eu',
            domain,
          }
        }
      }
      throw err
    }

    return {
      orgId: String(result.id),
      orgName: companyName,
      region: 'eu',
      domain,
    }
  }

  async getPermissionGroups() {
    if (!this.apiEnabled) return [{ id: 1, name: 'Administrator' }]
    const result = await this.request('/api/v1/users/groups/')
    return result.results || []
  }

  async inviteAdmin({ orgId, adminName, adminEmail }) {
    if (!this.apiEnabled) {
      return {
        userId: `pp-user-${Date.now()}`,
        orgId,
        adminName,
        adminEmail,
        invited: true,
      }
    }

    const groups = await this.getPermissionGroups()
    const adminGroup = groups.find((g) => /admin/i.test(g.name)) || groups[0]

    let result
    try {
      result = await this.request('/api/v1/users/invite_user/', {
        method: 'POST',
        body: JSON.stringify({
          email: adminEmail,
          user_organization: Number(orgId),
          user_groups: adminGroup ? [adminGroup.id] : [],
        }),
      })
    } catch (err) {
      const msg = String(err?.message || '')
      // Invitation already exists for this email — caller should ask for a new admin email and retry.
      if (msg.includes('invitation with this e-mail address already exists')) {
        const invitationErr = new Error('Perception Point admin invitation already exists for this email. Provide a different admin email and retry.')
        invitationErr.code = 'PP_ADMIN_EMAIL_INVITATION_EXISTS'
        throw invitationErr
      }
      throw err
    }

    return {
      userId: String(result.id),
      orgId: String(result.user_organization),
      adminName,
      adminEmail: result.email,
      invited: true,
      invitationUrl: result.Invitation_url,
    }
  }

  async assignSeats({ orgId, seats }) {
    // No dedicated seat-assignment endpoint in provided docs.
    // Seats are set at organization creation via number_of_seats.
    return { orgId, seats, assigned: true }
  }

  async fetchSignals({ orgId }) {
    if (!this.apiEnabled) {
      const now = Date.now()
      const signal = now % 3
      if (signal === 0) return { health: true, scans: 0, consent: false, dnsReady: false, orgExists: true }
      if (signal === 1) return { health: true, scans: 1, consent: true, dnsReady: false, orgExists: true }
      return { health: true, scans: 3, consent: true, dnsReady: true, orgExists: true }
    }

    const health = await this.request('/health_check')
    const organizations = await this.request('/api/organizations/')
    const results = Array.isArray(organizations?.results) ? organizations.results : Array.isArray(organizations) ? organizations : []
    const orgExists = orgId ? results.some((org) => String(org.id) === String(orgId)) : true

    const systemHealthy =
      health?.description === 'system is running' &&
      health?.maintenance_mode === 'off' &&
      health?.hap === 'on' &&
      health?.statics === 'on'

    return {
      health: Boolean(systemHealthy),
      scans: 0,
      consent: false,
      dnsReady: false,
      orgExists,
      waitingForActivity: true,
      healthRaw: health,
    }
  }
}

module.exports = { PerceptionPointClient }
