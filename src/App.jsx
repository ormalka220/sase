import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProductProvider, useProduct } from './context/ProductContext'

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
const IntegratorDashboard        = lazy(() => import('./pages/integrator/Dashboard'))
const CustomersList              = lazy(() => import('./pages/integrator/CustomersList'))
const CreateCustomer             = lazy(() => import('./pages/integrator/CreateCustomer'))
const IntegratorCustomerProfile  = lazy(() => import('./pages/integrator/CustomerProfile'))
const IntegratorOnboarding       = lazy(() => import('./pages/integrator/Onboarding'))
const IntegratorReports          = lazy(() => import('./pages/integrator/Reports'))
const IntegratorSettings         = lazy(() => import('./pages/integrator/Settings'))
const OrdersList                 = lazy(() => import('./pages/integrator/OrdersList'))
const CreateOrder                = lazy(() => import('./pages/integrator/CreateOrder'))

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

// Customer pages — Perception Point
const PerceptionOverview = lazy(() => import('./pages/customer/PerceptionOverview'))
const PerceptionThreats  = lazy(() => import('./pages/customer/PerceptionThreats'))

function AllProductsOverview() {
  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-4" style={{ border: '1px solid rgba(124,58,237,0.25)' }}>
        <div className="text-sm font-semibold text-white">All Products Overview</div>
        <div className="text-xs text-slate-500 mt-1">תצוגה מאוחדת של Forti SASE ו-Perception Point</div>
      </div>
      <CustomerOverview />
      <PerceptionOverview />
    </div>
  )
}

function CustomerOverviewRouter() {
  const { product } = useProduct()
  if (product === 'perception') return <PerceptionOverview />
  if (product === 'all') return <AllProductsOverview />
  return <CustomerOverview />
}

function SaseOnlyRoute({ children }) {
  const { product } = useProduct()
  return product === 'perception' ? <Navigate to="/customer/overview" replace /> : children
}

function PerceptionOnlyRoute({ children }) {
  const { product } = useProduct()
  return product === 'sase' ? <Navigate to="/customer/overview" replace /> : children
}

export default function App() {
  return (
    <ProductProvider>
      <Suspense fallback={<div className="min-h-screen bg-navy-900" />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Distributor Portal */}
          <Route path="/distribution" element={<DistributorLayout />}>
            <Route index element={<Navigate to="/distribution/dashboard" replace />} />
            <Route path="dashboard"      element={<DistributorDashboard />} />
            <Route path="integrators"    element={<IntegratorsList />} />
            <Route path="integrators/new" element={<CreateIntegrator />} />
            <Route path="integrators/:id" element={<IntegratorProfile />} />
            <Route path="orders"         element={<OrdersApproval />} />
            <Route path="reports"        element={<DistributorReports />} />
            <Route path="settings"       element={<DistributorSettings />} />
          </Route>

          {/* Integrator Portal */}
          <Route path="/integrator" element={<IntegratorLayout />}>
            <Route index element={<Navigate to="/integrator/dashboard" replace />} />
            <Route path="dashboard"      element={<IntegratorDashboard />} />
            <Route path="customers"      element={<CustomersList />} />
            <Route path="customers/new"  element={<CreateCustomer />} />
            <Route path="customers/:id"  element={<IntegratorCustomerProfile />} />
            <Route path="orders"         element={<OrdersList />} />
            <Route path="orders/new"     element={<CreateOrder />} />
            <Route path="onboarding"     element={<IntegratorOnboarding />} />
            <Route path="reports"        element={<IntegratorReports />} />
            <Route path="settings"       element={<IntegratorSettings />} />
          </Route>

          {/* Customer Portal */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<Navigate to="/customer/overview" replace />} />
            <Route path="overview"   element={<CustomerOverviewRouter />} />
            <Route path="users"      element={<SaseOnlyRoute><CustomerUsers /></SaseOnlyRoute>} />
            <Route path="devices"    element={<SaseOnlyRoute><CustomerDevices /></SaseOnlyRoute>} />
            <Route path="sites"      element={<SaseOnlyRoute><CustomerSites /></SaseOnlyRoute>} />
            <Route path="policies"   element={<SaseOnlyRoute><CustomerPolicies /></SaseOnlyRoute>} />
            <Route path="alerts"     element={<SaseOnlyRoute><CustomerAlerts /></SaseOnlyRoute>} />
            <Route path="licenses"   element={<SaseOnlyRoute><CustomerLicenses /></SaseOnlyRoute>} />
            <Route path="threats"    element={<PerceptionOnlyRoute><PerceptionThreats /></PerceptionOnlyRoute>} />
            <Route path="email-scan" element={<PerceptionOnlyRoute><PerceptionOverview /></PerceptionOnlyRoute>} />
            <Route path="reports"    element={<CustomerReports />} />
            <Route path="settings"   element={<CustomerSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </ProductProvider>
  )
}
