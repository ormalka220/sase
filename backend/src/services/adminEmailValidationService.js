const { prisma } = require('../prisma')
const { PerceptionPointClient } = require('./perceptionPointClient')

const ppClient = new PerceptionPointClient()

async function checkPpInviteEmailExists(email) {
  if (!ppClient.apiEnabled) return { exists: false, checked: false }

  const normalized = String(email || '').trim().toLowerCase()
  if (!normalized) return { exists: false, checked: false }

  // Some PP tenants do not expose list endpoints for invitations/users (404).
  // To avoid noisy logs and false assumptions, skip remote-list validation here.
  // We still enforce local uniqueness and backend-time validation during provisioning.
  return { exists: false, checked: false, reason: 'PP invitation listing endpoints unavailable' }
}

async function validateAdminEmailForPP(email, options = {}) {
  const { ignoreCustomerId } = options
  const normalized = String(email || '').trim().toLowerCase()
  if (!normalized) {
    return { ok: false, reason: 'Email is required', code: 'EMAIL_REQUIRED' }
  }

  const allCustomers = await prisma.customer.findMany({
    select: { id: true, companyName: true, adminEmail: true },
  })
  const localExisting = allCustomers.find(
    (c) =>
      String(c.adminEmail || '').trim().toLowerCase() === normalized
      && (!ignoreCustomerId || c.id !== ignoreCustomerId)
  )
  if (localExisting) {
    return {
      ok: false,
      code: 'ADMIN_EMAIL_ALREADY_USED_LOCALLY',
      reason: `Admin email is already used by customer '${localExisting.companyName}'.`,
      existingCustomer: localExisting,
    }
  }

  // Defensive check from historical provisioning failures.
  // If this email already failed with "invitation exists", block before re-submission.
  const failedPpOrders = await prisma.order.findMany({
    where: {
      status: 'FAILED',
      failureReason: { contains: 'invitation' },
    },
    include: {
      customer: { select: { id: true, adminEmail: true, companyName: true } },
    },
    take: 200,
    orderBy: { createdAt: 'desc' },
  })
  const failedMatch = failedPpOrders.find((o) => {
    const sameEmail = String(o.customer?.adminEmail || '').trim().toLowerCase() === normalized
    if (!sameEmail) return false
    return !ignoreCustomerId || o.customer?.id !== ignoreCustomerId
  })
  if (failedMatch) {
    return {
      ok: false,
      code: 'PP_ADMIN_EMAIL_PREVIOUSLY_FAILED',
      reason: `Admin email was already rejected previously in Perception Point flow (customer: '${failedMatch.customer?.companyName || 'Unknown'}').`,
    }
  }

  const pp = await checkPpInviteEmailExists(normalized)
  if (pp.exists) {
    return {
      ok: false,
      code: 'PP_ADMIN_EMAIL_INVITATION_EXISTS',
      reason: 'Perception Point already has an invited/admin user with this email.',
    }
  }

  return { ok: true, checkedWithPP: pp.checked }
}

module.exports = { validateAdminEmailForPP }
