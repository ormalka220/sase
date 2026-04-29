import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth, ROLE_PORTAL } from './context/AuthContext'
import { ProductProvider, useProduct } from './context/ProductContext'
import { CustomerProductProvider, useCustomerProducts } from './context/CustomerProductContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { initAuditTools } from './i18n/auditHelper'

// Initialize i18n audit tools in development
if (process.env.NODE_ENV === 'development') {
  initAuditTools()
}

const LandingPage = lazy(() => import('./pages/LandingPage'))

// Layouts
const DistributorLayout = lazy(() => import('./layouts/DistributorLayout'))
const IntegratorLayout  = lazy(() => import('./layouts/IntegratorLayout'))
const CustomerLayout    = lazy(() => import('./layouts/CustomerLayout'))

// Distributor pages
const DistributorDashboard  = lazy(() => import('./pages/distributor/Dashboard'))
const IntegratorsList       = lazy(() => import('./pages/distributor/IntegratorsList'))
const CreateIntegrator      = lazy(() => import('./pages/distributor/CreateIntegrator'))
const IntegratorProfile     = lazy(() => import('./pages/distributor/IntegratorProfile'))
const DistributorReports    = lazy(() => import('./pages/distributor/Reports'))
const DistributorSettings   = lazy(() => import('./pages/distributor/Settings'))
const OrdersApproval        = lazy(() => import('./pages/distributor/OrdersApproval'))

// Integrator pages
const IntegratorDashboard       = lazy(() => import('./pages/integrator/Dashboard'))
const CustomersList             = lazy(() => import('./pages/integrator/CustomersList'))
const CreateCustomer            = lazy(() => import('./pages/integrator/CreateCustomer'))
const IntegratorCustomerProfile = lazy(() => import('./pages/integrator/CustomerProfile'))
const IntegratorOnboarding      = lazy(() => import('./pages/integrator/Onboarding'))
const IntegratorReports         = lazy(() => import('./pages/integrator/Reports'))
const IntegratorSettings        = lazy(() => import('./pages/integrator/Settings'))
const IntegratorBilling         = lazy(() => import('./pages/integrator/Billing'))
const OrdersList                = lazy(() => import('./pages/integrator/OrdersList'))
const CreateOrder               = lazy(() => import('./pages/integrator/CreateOrder'))
const OrderDetails              = lazy(() => import('./pages/integrator/OrderDetails'))

// Customer pages — SASE
const CustomerOverview  = lazy(() => import('./pages/customer/Overview'))
const CustomerUsers     = lazy(() => import('./pages/customer/Users'))
const CustomerDevices   = lazy(() => import('./pages/customer/Devices'))
const CustomerSites     = lazy(() => import('./pages/customer/Sites'))
const CustomerPolicies  = lazy(() => import('./pages/customer/Policies'))
const CustomerAlerts    = lazy(() => import('./pages/customer/Alerts'))
const CustomerLicenses  = lazy(() => import('./pages/customer/Licenses'))
const CustomerReports   = lazy(() => import('./pages/customer/Reports'))
const CustomerSettings  = lazy(() => import('./pages/customer/Settings'))
const CustomerSecurity  = lazy(() => import('./pages/customer/Security'))
const CustomerOnboarding = lazy(() => import('./pages/customer/Onboarding'))
const CustomerBilling   = lazy(() => import('./pages/customer/Billing'))

// Customer pages — Perception Point
const PerceptionOverview = lazy(() => import('./pages/customer/PerceptionOverview'))
const PerceptionThreats  = lazy(() => import('./pages/customer/PerceptionThreats'))

// ─── Protected route wrappers ─────────────────────────────────────────────────

function RequireAuth({ allowedRoles, redirectTo = '/' }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_PORTAL[user.role] || '/'} replace />
  }
  return null // let children render
}

function DistributorRoute({ children }) {
  const err = RequireAuth({ allowedRoles: ['SUPER_ADMIN', 'DISTRIBUTOR_ADMIN'] })
  return err || children
}

function IntegratorRoute({ children }) {
  const err = RequireAuth({ allowedRoles: ['SUPER_ADMIN', 'DISTRIBUTOR_ADMIN', 'INTEGRATOR_ADMIN'] })
  return err || children
}

function CustomerRoute({ children }) {
  const err = RequireAuth({ allowedRoles: ['SUPER_ADMIN', 'DISTRIBUTOR_ADMIN', 'INTEGRATOR_ADMIN', 'CUSTOMER_ADMIN', 'CUSTOMER_VIEWER'] })
  return err || children
}

// ─── Product-aware customer route guards ─────────────────────────────────────

function SaseOnlyRoute({ children }) {
  const { product } = useProduct()
  return product === 'perception' ? <Navigate to="/customer/overview" replace /> : children
}

function PerceptionOnlyRoute({ children }) {
  const { product } = useProduct()
  return product === 'sase' ? <Navigate to="/customer/overview" replace /> : children
}

function CustomerOverviewRouter() {
  const { product } = useProduct()
  const { hasBoth, hasSase, hasPerception, loading } = useCustomerProducts()
  const { tr } = useLanguage()

  if (loading) return null

  // Route to the right overview based on what the customer actually owns
  if (hasBoth) {
    if (product === 'perception') return <PerceptionOverview />
    if (product === 'sase') return <CustomerOverview />
    return (
      <div className="space-y-6">
        <CustomerOverview />
        <PerceptionOverview />
      </div>
    )
  }
  if (hasPerception) return <PerceptionOverview />
  if (hasSase) return <CustomerOverview />
  // No products yet
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-slate-500 text-sm">{tr('אין מוצרים פעילים. פנו לאינטגרטור להתחלה.', 'No active products. Contact your integrator to get started.')}</p>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProductProvider>
          <CustomerProductProvider>
            <Suspense fallback={<div className="min-h-screen bg-navy-900" />}>
              <Routes>
              <Route path="/" element={<LandingPage />} />

              {/* Distributor Portal */}
              <Route
                path="/distribution"
                element={<DistributorRoute><DistributorLayout /></DistributorRoute>}
              >
                <Route index element={<Navigate to="/distribution/dashboard" replace />} />
                <Route path="dashboard"       element={<DistributorDashboard />} />
                <Route path="integrators"     element={<IntegratorsList />} />
                <Route path="integrators/new" element={<CreateIntegrator />} />
                <Route path="integrators/:id" element={<IntegratorProfile />} />
                <Route path="orders"          element={<OrdersApproval />} />
                <Route path="reports"         element={<DistributorReports />} />
                <Route path="settings"        element={<DistributorSettings />} />
              </Route>

              {/* Integrator Portal */}
              <Route
                path="/integrator"
                element={<IntegratorRoute><IntegratorLayout /></IntegratorRoute>}
              >
                <Route index element={<Navigate to="/integrator/dashboard" replace />} />
                <Route path="dashboard"      element={<IntegratorDashboard />} />
                <Route path="customers"      element={<CustomersList />} />
                <Route path="customers/new"  element={<CreateCustomer />} />
                <Route path="customers/:id"  element={<IntegratorCustomerProfile />} />
                <Route path="orders"         element={<OrdersList />} />
                <Route path="orders/:id"     element={<OrderDetails />} />
                <Route path="orders/new"     element={<CreateOrder />} />
                <Route path="onboarding"     element={<IntegratorOnboarding />} />
                <Route path="billing"        element={<IntegratorBilling />} />
                <Route path="reports"        element={<IntegratorReports />} />
                <Route path="settings"       element={<IntegratorSettings />} />
              </Route>

              {/* Customer Portal */}
              <Route
                path="/customer"
                element={<CustomerRoute><CustomerLayout /></CustomerRoute>}
              >
                <Route index element={<Navigate to="/customer/overview" replace />} />
                <Route path="overview"    element={<CustomerOverviewRouter />} />
                <Route path="security"    element={<CustomerSecurity />} />
                <Route path="onboarding"  element={<CustomerOnboarding />} />
                <Route path="billing"     element={<CustomerBilling />} />
                <Route path="users"       element={<SaseOnlyRoute><CustomerUsers /></SaseOnlyRoute>} />
                <Route path="devices"     element={<SaseOnlyRoute><CustomerDevices /></SaseOnlyRoute>} />
                <Route path="sites"       element={<SaseOnlyRoute><CustomerSites /></SaseOnlyRoute>} />
                <Route path="policies"    element={<SaseOnlyRoute><CustomerPolicies /></SaseOnlyRoute>} />
                <Route path="alerts"      element={<SaseOnlyRoute><CustomerAlerts /></SaseOnlyRoute>} />
                <Route path="licenses"    element={<SaseOnlyRoute><CustomerLicenses /></SaseOnlyRoute>} />
                <Route path="threats"     element={<PerceptionOnlyRoute><PerceptionThreats /></PerceptionOnlyRoute>} />
                <Route path="email-scan"  element={<PerceptionOnlyRoute><PerceptionOverview /></PerceptionOnlyRoute>} />
                <Route path="reports"     element={<CustomerReports />} />
                <Route path="settings"    element={<CustomerSettings />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </CustomerProductProvider>
        </ProductProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
