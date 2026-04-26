# Perception Point API Integration Reference

## Base Setup

- **Auth header**: `Authorization: Token <PP_API_TOKEN>`
- **Rate limit**: default target 100 requests/minute (implement retry/backoff on 429/5xx)
- **Region base URLs**:
  - US: `https://api.perception-point.io`
  - EU: `https://api.eu.perception-point.io`
  - AUS: `https://api.aus.perception-point.io`

## Core Endpoints by Domain

### Provisioning / Tenant Lifecycle

- `POST /api/organizations/` - create organization
- `GET /api/organizations/` - list organizations (used for existence checks)
- `POST /api/v1/users/invite_user/` - invite admin user
- `GET /api/v1/users/groups/` - fetch permission groups for admin mapping

### Onboarding & Health

- `GET /health_check` - global service health
- `GET /api/organizations/` - verify org creation
- `GET /api/scans/` (or account-equivalent scans endpoint) - detect activity/protection state

### Security Operations

- Files scan APIs (if enabled by license/account)
- URLs scan APIs (if enabled by license/account)
- Scan details/list endpoints
- Change verdict / release email / request investigation endpoints
- Allowlist/Blocklist + VIP users endpoints (if enabled)

### Reporting & Audit

- Reports endpoints (periodic/summary data)
- Audit log endpoints
- Completed jobs endpoints

## Required Provisioning Payload Fields (Org Creation)

Expected minimum payload that works with current account:

```json
{
  "name": "Customer Company",
  "active": true,
  "number_of_seats": 50,
  "origins": { "office365": true },
  "email_report_recipients": "admin@customer.com",
  "client_alert_admin_email_addresses": "admin@customer.com"
}
```

## System Mapping (Endpoint -> Backend -> Frontend)

| PP / Internal Source | Backend Route | Frontend Screen |
| --- | --- | --- |
| `POST /api/organizations/`, invite admin | `POST /api/orders/:id/pay` and `POST /api/orders/:id/approve` | Integrator `CreateOrder` flow |
| `GET /health_check` + org existence + activity heuristic | `GET /api/workspace-security/customers/:customerId/integration-status` | Integrator `Onboarding`, Customer `PerceptionOverview` |
| tenant + customer state in DB | `GET /api/workspace-security/customers/:customerId/onboarding` | Integrator `Onboarding` |
| tenant + logs + orders + customers (DB) | `GET /api/workspace-security/overview` | Integrator `Dashboard` |
| tenant + customers + orders (DB) | `GET /api/workspace-security/customers-list` | Integrator `CustomersList` |
| customer + tenant + status logs (DB) | `GET /api/workspace-security/customers/:customerId/profile` | Integrator `CustomerProfile` |
| orders + tenants + status logs (DB) | `GET /api/workspace-security/reports-summary` | Integrator/Distributor `Reports` |
| audit/status logs (DB + PP signal details) | `GET /api/workspace-security/customers/:customerId/audit` | Customer `PerceptionThreats` / profile widgets |

## Error Handling Contract

- Backend always returns JSON:
  - success: `2xx + application/json`
  - failure: `{ "error": "<human readable message>" }`
- External PP errors are normalized into safe UI messages while preserving internal logs.

## Demo Scope Decision

- **Perception Point** screens and flows are connected to real DB/backend data.
- **FortiSASE** remains demo/mock until dedicated SASE APIs are available.
