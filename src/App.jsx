import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const PartnerLayout = lazy(() => import('./layouts/PartnerLayout'))
const CustomerLayout = lazy(() => import('./layouts/CustomerLayout'))
const PartnerDashboard = lazy(() => import('./pages/partner/Dashboard'))
const PartnerSolutions = lazy(() => import('./pages/partner/Solutions'))
const PartnerSolutionDetail = lazy(() => import('./pages/partner/SolutionDetail'))
const PartnerCompare = lazy(() => import('./pages/partner/Compare'))
const PartnerOpportunities = lazy(() => import('./pages/partner/Opportunities'))
const PartnerSalesKit = lazy(() => import('./pages/partner/SalesKit'))
const PartnerCustomers = lazy(() => import('./pages/partner/Customers'))
const CustomerOverview = lazy(() => import('./pages/customer/Overview'))
const CustomerSecurity = lazy(() => import('./pages/customer/Security'))
const CustomerUsers = lazy(() => import('./pages/customer/Users'))
const CustomerActivity = lazy(() => import('./pages/customer/Activity'))
const CustomerServices = lazy(() => import('./pages/customer/Services'))
const CustomerReports = lazy(() => import('./pages/customer/Reports'))
const CustomerSupport = lazy(() => import('./pages/customer/Support'))

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Partner Portal */}
        <Route path="/partner" element={<PartnerLayout />}>
          <Route index element={<Navigate to="/partner/dashboard" replace />} />
          <Route path="dashboard" element={<PartnerDashboard />} />
          <Route path="solutions" element={<PartnerSolutions />} />
          <Route path="solutions/:id" element={<PartnerSolutionDetail />} />
          <Route path="compare" element={<PartnerCompare />} />
          <Route path="opportunities" element={<PartnerOpportunities />} />
          <Route path="sales-kit" element={<PartnerSalesKit />} />
          <Route path="customers" element={<PartnerCustomers />} />
        </Route>

        {/* Customer Portal */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="/customer/overview" replace />} />
          <Route path="overview" element={<CustomerOverview />} />
          <Route path="security" element={<CustomerSecurity />} />
          <Route path="users" element={<CustomerUsers />} />
          <Route path="activity" element={<CustomerActivity />} />
          <Route path="services" element={<CustomerServices />} />
          <Route path="reports" element={<CustomerReports />} />
          <Route path="support" element={<CustomerSupport />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
