# Integrator Portal - Complete Implementation Guide

## ✅ What's Been Built

### Foundation
- **IntegratorLayout.jsx** - Premium sidebar + topbar navigation
- **Login.jsx** - Premium login screen with error states
- **Dashboard.jsx** - KPI cards + quick actions

### Components
- **StepCard.jsx** - Expandable step card for onboarding

### Critical Pages
- **Onboarding.jsx** - THE MOST IMPORTANT SCREEN
  - 7-step progression visualization
  - Live progress bar
  - Connection modals (365, Gmail, DNS)
  - Completion celebration animation

## 🚀 Remaining Screens to Build

### PHASE 2: Customers Management

#### 1. **Customers List** (`/integrator/customers`)
```
Path: src/pages/integrator/Customers.jsx

Features:
- Table/card hybrid view
- Columns: Name, Status, Health %, Stage, Last Activity, Actions
- Status badges (Active, Onboarding, Failed, Inactive)
- Health % visual indicator (progress bar)
- Search + filter by status
- Click row → open Customer Profile drawer
- Empty state with "Create Customer" CTA

Data needed:
- List of customer objects with status, health%, onboarding stage
- Click handlers to open profile

Use components:
- DarkTable (from distribution/DarkTable.jsx)
- StatusBadge
- DetailDrawer
- EmptyState
```

#### 2. **Create Customer Wizard** (`/integrator/customers/create`)
```
Path: src/pages/integrator/CreateCustomer.jsx

Multi-step form:
Step 1: Basic Info
  - Company name (required)
  - Domain (required)
  - Contact name (required)
  - Contact email (required)
  - Contact phone
  - Estimated users for PP (number)

Step 2: Review
  - Display all entered data
  - "Back" and "Create" buttons

Step 3: Success
  - Confirmation message
  - "Create Order" or "View Customer" CTAs

Patterns:
- Use Framer Motion for step transitions
- Form validation before next step
- Progress bar at top showing step 1/2/3
- Smooth transitions between steps
```

#### 3. **Customer Profile** (`/integrator/customers/:id`)
```
Path: src/pages/integrator/CustomerProfile.jsx

Tabbed interface:
- Overview: Basic info, products, health status
- Orders: Table of all orders for this customer
- Onboarding: Timeline + current stage
- Billing: Invoices + usage summary
- Settings: Edit contact info, team members (future)

Features:
- Right-side drawer actions (Edit, Delete, View Onboarding)
- Live data from customer entity
- Each tab loads different data
- Navigation between tabs is smooth
```

### PHASE 3: Orders Management

#### 4. **Orders List** (`/integrator/orders`)
```
Path: src/pages/integrator/Orders.jsx

Table features:
- Columns: Order ID, Customer, Package, Status, Submitted Date, Est. Revenue, Actions
- Status badges: Pending, Approved, Provisioning, Active, Failed
- Search by customer name or order ID
- Filter by status dropdown
- Click row → Order Details drawer
- Empty state with "Create Order" CTA

Key fields:
- order.id
- order.customer.name
- order.package (Basic, Advanced, Enterprise)
- order.status
- order.createdAt
- order.totalAmount
```

#### 5. **Create Order Wizard** (`/integrator/orders/create`)
```
Path: src/pages/integrator/CreateOrder.jsx

Step 1: Select Customer & Package
  - Customer dropdown (list of your customers)
  - PP Package cards (Basic, Advanced, Enterprise with pricing)
  - Estimated mailboxes input (number)
  - Real-time price calculation
  - Billing cycle toggle (Monthly / Annual)

Step 2: Review
  - Summary of all selections
  - Show: Customer, Package, Users, Cycle, Price
  - Billing notice: "Invoice only, final bill based on actual usage"
  - Edit button (back to step 1)

Step 3: Success
  - Order submitted message
  - Status: "Waiting for CData approval"
  - "Start Onboarding" button
  - "View Order" button

IMPORTANT:
- Live price calculation: estimated_users × price_per_mailbox
- Show billing disclaimer on review step
- Annual discount (e.g., 10% off)
- Final invoice based on actual usage in PP
```

#### 6. **Order Details** (`/integrator/orders/:id`)
```
Path: Can be a drawer component or modal

Shows:
- Order ID, Status, Dates (submitted, approved, activated)
- Customer details (name, domain, admin email)
- Package selected + estimated mailboxes
- Price breakdown
- Timeline of order events
- Actions: "Start Onboarding" (if status is approved), "Download Invoice" (if billed)
```

### PHASE 4: Billing & Analytics

#### 7. **Billing / Invoices** (`/integrator/billing`)
```
Path: src/pages/integrator/Billing.jsx

Summary cards:
- Total estimated revenue (sum of all active orders' totals)
- Total actual usage (sum of all PP actual mailboxes)
- Total invoices count
- Next invoice date (estimate)

Invoices table:
- Columns: Invoice ID, Customer, Date, Amount, Status (Paid/Draft/Overdue), Actions
- Click → Invoice Details drawer
- Download PDF button
- Mark as paid button (future)

Invoice details drawer:
- Line items (per mailbox costs, date range, service period)
- Note: "Actual protected mailboxes detected in Perception Point"
- PDF export
- Share with customer button (future)
```

#### 8. **Reports** (`/integrator/reports`)
```
Path: src/pages/integrator/Reports.jsx

Date range picker (default: last 30 days)

Report sections:
1. Revenue Report
   - Total revenue
   - By customer breakdown table
   - Trend chart (Recharts area chart)

2. Customer Report
   - List of customers with health status
   - Sort by revenue, customers, status
   - Health % indicator

3. Onboarding Report
   - # customers in each stage
   - Time-to-activate metric
   - Success rate %

4. Usage Report
   - Estimated vs actual mailbox comparison
   - Variance calculation
   - Top customers by usage

Charts:
- Use Recharts (same as distributor portal)
- Dark theme styling
- Hover tooltips
```

### PHASE 5: Settings & Support

#### 9. **Settings** (`/integrator/settings`)
```
Path: src/pages/integrator/Settings.jsx

Sections:
- Profile: Company name, contact, logo upload (placeholder)
- Notifications: Checkboxes for order status, onboarding alerts
- PP Integration: API key (placeholder)
- Team: Add team members (future)
- Support: FAQ, documentation links
```

#### 10. **Error & Empty States**
```
Empty states needed:
- No customers yet → CTA to create
- No orders yet → CTA to create
- No invoices yet → Explanation card
- Onboarding not started → CTA to start
- No reports data → "Try different date range"

Error states:
- API error → Toast + retry button
- Customer not found (404) → Back button
- Network error → Offline banner
- Permission denied → Unauthorized message
```

---

## 🎨 Design Patterns to Follow

### Form Patterns
```javascript
// Multi-step form template
const [currentStep, setCurrentStep] = useState(1)
const [formData, setFormData] = useState({...})
const [errors, setErrors] = useState({})

const handleNext = () => {
  if (validateStep(currentStep)) {
    setCurrentStep(currentStep + 1)
  }
}

return (
  <div>
    {/* Progress bar */}
    <div className="h-2 bg-white/5">
      <div style={{ width: `${(currentStep / 3) * 100}%` }} className="h-full bg-cdata-500" />
    </div>

    {/* Step content */}
    {currentStep === 1 && <Step1Component />}
    {currentStep === 2 && <Step2Component />}
    {currentStep === 3 && <Step3Component />}

    {/* Navigation */}
    <div className="flex gap-2">
      {currentStep > 1 && <button onClick={() => setCurrentStep(currentStep - 1)}>Back</button>}
      {currentStep < 3 && <button onClick={handleNext}>Next</button>}
      {currentStep === 3 && <button onClick={handleSubmit}>Submit</button>}
    </div>
  </div>
)
```

### Modal/Drawer Pattern
```javascript
// Reuse DetailDrawer component
import DetailDrawer from '../../components/distribution/DetailDrawer'

<DetailDrawer
  isOpen={isOpen}
  onClose={onClose}
  title="Order Details"
  tabs={[
    { id: 'summary', label: 'Summary' },
    { id: 'timeline', label: 'Timeline' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
>
  {activeTab === 'summary' && <SummaryContent />}
  {activeTab === 'timeline' && <TimelineContent />}
</DetailDrawer>
```

### Table Pattern
```javascript
// Use DarkTable component for consistency
<DarkTable
  columns={[
    { key: 'name', label: 'Name', width: '30%' },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'revenue', label: 'Revenue', width: '20%' },
  ]}
  data={customers}
  onRowClick={(customer) => openProfile(customer.id)}
  sortable
/>
```

### Animation Pattern
```javascript
// Use Framer Motion for all animations
import { motion } from 'framer-motion'

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

<motion.div initial="hidden" animate="visible" variants={pageVariants}>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 📊 Data Model Examples

```javascript
// Customer object
{
  id: 'cust-123',
  name: 'Acme Corp',
  domain: 'acme.com',
  integrator_id: 'int-1',
  status: 'active', // active, onboarding, failed, inactive
  health: 85, // 0-100
  onboarding_stage: 'admin_invited', // submitted, cdata_approval, pp_org_created, admin_invited, m365_connect, gmail_connect, dns_pending, active, failed
  contact: { name: 'John Doe', email: 'john@acme.com', phone: '+1...' },
  estimated_users: 250,
  created_at: '2024-01-10',
  last_activity: '2024-01-15',
}

// Order object
{
  id: 'order-456',
  customer_id: 'cust-123',
  integrator_id: 'int-1',
  product: 'perception', // perception, sase
  package: 'advanced', // basic, advanced, enterprise
  estimated_users: 250,
  billing_cycle: 'monthly', // monthly, annual
  total_amount: 1250,
  status: 'approved_by_cdata', // pending_approval, approved_by_cdata, provisioning, active, rejected, failed
  created_at: '2024-01-10',
  approved_at: '2024-01-11',
  timeline: [
    { event: 'submitted', timestamp: '2024-01-10 10:00' },
    { event: 'cdata_approved', timestamp: '2024-01-11 14:30' },
    { event: 'pp_org_created', timestamp: '2024-01-12 08:00' },
  ]
}

// Invoice object
{
  id: 'inv-789',
  customer_id: 'cust-123',
  integrator_id: 'int-1',
  order_id: 'order-456',
  period_start: '2024-01-01',
  period_end: '2024-01-31',
  estimated_users: 250,
  actual_users: 243, // from PP
  amount: 1250,
  status: 'draft', // draft, sent, paid, overdue
  created_at: '2024-02-01',
  line_items: [
    { description: 'Perception Point - Jan 2024', quantity: 243, price_per_unit: 5.14, total: 1249.02 }
  ]
}
```

---

## 🔗 Routing Setup

Add these routes to `src/App.jsx`:

```javascript
// Protected integrator routes
{
  path: '/integrator',
  element: <IntegratorLayout />,
  children: [
    { path: 'dashboard', element: <IntegratorDashboard /> },
    { path: 'customers', element: <Customers /> },
    { path: 'customers/create', element: <CreateCustomer /> },
    { path: 'customers/:id', element: <CustomerProfile /> },
    { path: 'orders', element: <Orders /> },
    { path: 'orders/create', element: <CreateOrder /> },
    { path: 'orders/:id', element: <OrderDetails /> },
    { path: 'billing', element: <Billing /> },
    { path: 'onboarding/:id', element: <Onboarding /> },
    { path: 'reports', element: <Reports /> },
    { path: 'settings', element: <Settings /> },
  ]
},
{ path: '/integrator/login', element: <IntegratorLogin /> },
```

---

## 💡 Implementation Tips

1. **Reuse components** from distributor portal (DarkTable, DetailDrawer, EmptyState, etc.)
2. **Mock data first** - Create realistic customer/order/invoice objects in mock data
3. **Test flows** - Make sure Create Customer → Create Order → Onboarding works end-to-end
4. **Navigation** - Use useNavigate to move between screens
5. **Animations** - Keep them consistent (200-300ms, easeOut)
6. **Mobile** - Test responsive layouts (grid to stack on mobile)
7. **Loading states** - Use LoadingSkeleton while fetching data
8. **Error handling** - Show toast or modal for errors
9. **RTL support** - Use rtl: Tailwind variant if needed
10. **Performance** - Lazy load pages with React.lazy() if needed

---

## 🎯 Success Criteria

✓ All 13+ screens built
✓ All 3 critical flows work end-to-end:
  - Create Customer → Create Order → Wait for CData → Onboarding
  - Onboarding → Connect 365 → Connect Gmail → Activate
  - Usage recorded → Billing → Invoice generated
✓ Onboarding screen is engaging and clear
✓ Animations are smooth (60fps)
✓ Mobile responsive
✓ Empty states professional
✓ Error handling graceful
✓ Premium SaaS feel (not admin UI)
✓ Fast navigation between pages

---

## 📝 Next Steps

1. **Build Customers list page** (`Customers.jsx`)
   - Reuse DarkTable component
   - Add search and filters
   - Implement click-to-profile drawer

2. **Build Create Customer wizard** (`CreateCustomer.jsx`)
   - Multi-step form with validation
   - Review step before submission
   - Success confirmation

3. **Build Customer Profile** (`CustomerProfile.jsx`)
   - Tabbed interface
   - Show orders, onboarding, billing for customer

4. **Repeat for Orders** (List, Create, Details)

5. **Build Billing** with invoice list and details

6. **Build Reports** with charts and breakdowns

This structure ensures you build the most valuable pages first and reuse components efficiently!
