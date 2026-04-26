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
      const details = await response.text()
      throw new Error(`Perception Point API error (${response.status}): ${details}`)
    }

    if (response.status === 204) return null
    return response.json()
  }

  async createOrganization({ companyName, domain, seats }) {
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
      origins: ['office365'],
      email_report_recipients: null,
    }

    const result = await this.request('/api/organizations/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

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

    const result = await this.request('/api/v1/users/invite_user/', {
      method: 'POST',
      body: JSON.stringify({
        email: adminEmail,
        user_organization: Number(orgId),
        user_groups: adminGroup ? [adminGroup.id] : [],
      }),
    })

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
