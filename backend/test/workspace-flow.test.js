const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const { execSync } = require('node:child_process')
process.env.PP_API_ENABLED = 'false'
const { app } = require('../src/app')

function auth(role, userId = 'test-user') {
  return { 'x-role': role, 'x-user-id': userId }
}

test.before(() => {
  execSync('npx prisma migrate dev --name test_sync', { cwd: process.cwd(), stdio: 'ignore' })
  execSync('npm run seed', { cwd: process.cwd(), stdio: 'ignore' })
})

test('credit-card order auto provisions workspace security', async () => {
  const createRes = await request(app)
    .post('/api/orders')
    .set(auth('integrator'))
    .send({
      distributorId: 'd1',
      integratorId: 'i1',
      customerId: 'c1',
      productType: 'WORKSPACE_SECURITY',
      seats: 100,
      billingType: 'CREDIT_CARD',
      amount: 300,
      currency: 'USD',
    })

  assert.equal(createRes.statusCode, 201)
  assert.equal(createRes.body.status, 'PAYMENT_PENDING')

  const payRes = await request(app)
    .post(`/api/orders/${createRes.body.id}/pay`)
    .set(auth('integrator'))

  assert.equal(payRes.statusCode, 200)
  assert.ok(['ONBOARDING_PENDING', 'PROVISIONED'].includes(payRes.body.status))
})

test('invoice order requires distributor approval', async () => {
  const createRes = await request(app)
    .post('/api/orders')
    .set(auth('integrator'))
    .send({
      distributorId: 'd1',
      integratorId: 'i1',
      customerId: 'c2',
      productType: 'WORKSPACE_SECURITY',
      seats: 50,
      billingType: 'MONTHLY_INVOICE',
      amount: 150,
      currency: 'USD',
    })

  assert.equal(createRes.statusCode, 201)
  assert.equal(createRes.body.status, 'PENDING_DISTRIBUTOR_APPROVAL')

  const approveRes = await request(app)
    .post(`/api/orders/${createRes.body.id}/approve`)
    .set(auth('distributor'))

  assert.equal(approveRes.statusCode, 200)
  assert.ok(['ONBOARDING_PENDING', 'PROVISIONED'].includes(approveRes.body.status))
})

test('manual integration completion fallback works', async () => {
  const markRes = await request(app)
    .post('/api/workspace-security/customers/c1/mark-integration-complete')
    .set(auth('distributor', 'dist-admin'))

  assert.equal(markRes.statusCode, 200)
  assert.equal(markRes.body.success, true)

  const statusRes = await request(app)
    .get('/api/workspace-security/customers/c1/integration-status')
    .set(auth('integrator'))

  assert.equal(statusRes.statusCode, 200)
  assert.ok(statusRes.body.state)
})
