class EmailService {
  async sendCustomerOnboardingEmail({ customer, portalUrl }) {
    return {
      to: customer.adminEmail,
      subject: 'Complete your Perception Point setup',
      body: `Organization: ${customer.companyName}\nAdmin: ${customer.adminEmail}\nPortal: ${portalUrl}`,
    }
  }

  async sendIntegratorProvisionedEmail({ integratorId, orderId }) {
    return { integratorId, orderId, sent: true }
  }

  async sendDistributorProvisionedEmail({ distributorId, orderId, onboardingCompleted = false }) {
    return { distributorId, orderId, onboardingCompleted, sent: true }
  }
}

module.exports = { EmailService }
