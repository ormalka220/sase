const { prisma } = require('../prisma')

async function auditLog({ entityType, entityId, action, actor, oldState, newState, metadata, orderId, customerId }) {
  try {
    await prisma.auditLog.create({
      data: {
        entityType,
        entityId,
        action,
        actorId: actor?.userId || 'system',
        actorRole: actor?.role || 'SYSTEM',
        oldState: oldState ? JSON.stringify(oldState) : null,
        newState: newState ? JSON.stringify(newState) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        orderId: orderId || null,
        customerId: customerId || null,
      },
    })
  } catch (err) {
    // Audit failures must not break business operations
    console.error('[AuditLog Error]', err.message)
  }
}

module.exports = { auditLog }
