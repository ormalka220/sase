# SASE i18n Migration Guide

## ✅ COMPLETED INFRASTRUCTURE

### 1. Core i18n Setup
- **`src/context/LanguageContext.jsx`** - Enhanced with RTL/LTR class management
- **`src/i18n/labels.js`** - Comprehensive centralized translation labels (600+ keys)
- **`src/i18n/auditHelper.js`** - Development tools to detect hardcoded strings
- **`src/App.jsx`** - Audit tools initialized in development mode

### 2. Updated Components & Layouts
✅ **Layouts (COMPLETE)**
- `src/layouts/DistributorLayout.jsx` - Using labels
- `src/layouts/IntegratorLayout.jsx` - Using labels
- `src/layouts/CustomerLayout.jsx` - Using labels

✅ **Shared Components (COMPLETE)**
- `src/components/LanguageSwitch.jsx` - Language selection
- `src/components/ProductSwitch.jsx` - Product selection using labels
- `src/components/StateViews.jsx` - Loading, Error, Empty states using labels

### 3. RTL/LTR Layout Support
- Document element gets `rtl` or `ltr` class based on language
- Body element also gets the class for full coverage
- Sidebar positioning handled via RTL flexbox reversal in layouts
- Text alignment handled automatically by CSS via `rtl:` prefix

---

## 🔧 HOW TO COMPLETE THE MIGRATION

### Pattern: How to Update a Component/Page

#### Before:
```jsx
import React from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function MyComponent() {
  const { tr, isHebrew } = useLanguage()
  
  return (
    <div>
      <h1>{isHebrew ? 'שלום' : 'Hello'}</h1>
      <p>Create Customer</p>
      <button>Save</button>
    </div>
  )
}
```

#### After:
```jsx
import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { getCommonLabels } from '../i18n/labels'

export default function MyComponent() {
  const { tr } = useLanguage()
  const labels = getCommonLabels(tr)
  
  return (
    <div>
      <h1>{tr('שלום', 'Hello')}</h1>
      <p>{labels.actions.create} {labels.portals.customer}</p>
      <button>{labels.actions.save}</button>
    </div>
  )
}
```

### Step-by-Step Update Process

**For each file that needs i18n updates:**

1. **Import at the top:**
   ```jsx
   import { useLanguage } from '../context/LanguageContext'
   import { getCommonLabels } from '../i18n/labels'
   ```

2. **Initialize labels in component:**
   ```jsx
   const { tr } = useLanguage()
   const labels = getCommonLabels(tr)
   ```

3. **Replace hardcoded strings:**
   - Look for plain English: `'Dashboard'` → `labels.navigation.dashboard`
   - Look for plain Hebrew: `'לוח בקרה'` → use existing label or add to labels.js
   - Look for `tr('he', 'en')` → replace with `labels.section.key`
   - Look for `labelHe`/`labelEn` patterns → create `createItems(labels)` function

4. **For data arrays with labels:**
   ```jsx
   // Before
   const items = [
     { labelHe: 'פעיל', labelEn: 'Active' },
     { labelHe: 'ממתין', labelEn: 'Pending' },
   ]

   // After
   const createItems = (labels) => [
     { label: labels.statuses.active },
     { label: labels.statuses.pending },
   ]
   
   // In component
   const items = createItems(labels)
   ```

5. **Run audit to verify:**
   ```javascript
   // In browser console:
   window.__i18nAudit.auditHardcodedStrings()
   ```

---

## 📋 PRIORITY FILES TO UPDATE

### Tier 1: Critical Paths (Update First)
These files are visible in primary user journeys:

**Distributor Portal:**
- [ ] `src/pages/distributor/Dashboard.jsx` - Main entry point
- [ ] `src/pages/distributor/IntegratorsList.jsx` - Channel partner list
- [ ] `src/pages/distributor/Settings.jsx` - Configuration

**Integrator Portal:**
- [ ] `src/pages/integrator/Dashboard.jsx` - Main entry point
- [ ] `src/pages/integrator/CustomersList.jsx` - Customer list
- [ ] `src/pages/integrator/CreateOrder.jsx` - Order creation

**Customer Portal:**
- [ ] `src/pages/customer/Overview.jsx` - Main entry point
- [ ] `src/pages/customer/Security.jsx` - Security details
- [ ] `src/pages/customer/Devices.jsx` - Device management

### Tier 2: Distribution Components (Update Second)
These are used across dashboard pages:

- [ ] `src/components/distribution/OrderCard.jsx`
- [ ] `src/components/distribution/ApprovalQueuePreview.jsx`
- [ ] `src/components/distribution/OnboardingHealthSection.jsx`
- [ ] `src/components/distribution/IntegratorCard.jsx`
- [ ] `src/components/distribution/RevenueChartsSection.jsx`
- [ ] `src/components/distribution/ActivityFeed.jsx`
- [ ] `src/components/distribution/EmptyState.jsx`
- [ ] `src/components/distribution/StatusBadge.jsx`

### Tier 3: Other Pages (Update Third)
Lower-priority pages:

**Distributor:**
- [ ] `src/pages/distributor/Reports.jsx`
- [ ] `src/pages/distributor/CreateIntegrator.jsx`
- [ ] `src/pages/distributor/IntegratorProfile.jsx`
- [ ] `src/pages/distributor/OrdersApproval.jsx`

**Integrator:**
- [ ] `src/pages/integrator/Onboarding.jsx`
- [ ] `src/pages/integrator/Billing.jsx`
- [ ] `src/pages/integrator/Reports.jsx`
- [ ] `src/pages/integrator/Settings.jsx`
- [ ] `src/pages/integrator/OrdersList.jsx`
- [ ] `src/pages/integrator/OrderDetails.jsx`
- [ ] `src/pages/integrator/CreateCustomer.jsx`
- [ ] `src/pages/integrator/CustomerProfile.jsx`

**Customer:**
- [ ] `src/pages/customer/Users.jsx`
- [ ] `src/pages/customer/Devices.jsx`
- [ ] `src/pages/customer/Sites.jsx`
- [ ] `src/pages/customer/Policies.jsx`
- [ ] `src/pages/customer/Alerts.jsx`
- [ ] `src/pages/customer/Licenses.jsx`
- [ ] `src/pages/customer/Reports.jsx`
- [ ] `src/pages/customer/Billing.jsx`
- [ ] `src/pages/customer/Settings.jsx`
- [ ] `src/pages/customer/PerceptionOverview.jsx`
- [ ] `src/pages/customer/PerceptionThreats.jsx`
- [ ] `src/pages/customer/Services.jsx`

### Tier 4: Shared Components (Update Last)
- [ ] `src/components/OnboardingChecklist.jsx`
- [ ] `src/components/OrderTimeline.jsx`
- [ ] `src/components/integrator/StepCard.jsx`

---

## 🔍 AVAILABLE LABELS IN `src/i18n/labels.js`

```javascript
labels.navigation.*  // Dashboard, Customers, Orders, etc.
labels.actions.*     // Create, Save, Cancel, Approve, etc.
labels.products.*    // All, FortiSASE, Perception Point, etc.
labels.statuses.*    // Active, Pending, Approved, etc.
labels.portals.*     // Distribution, Integrator, Customer
labels.roles.*       // Admin, SuperAdmin, etc.
labels.errors.*      // SomethingWentWrong, FailedToLoad, etc.
labels.emptyStates.* // NoCustomers, NoOrders, NoData, etc.
labels.ui.*          // Loading, Error, Success, etc.
labels.forms.*       // CompanyName, Email, RequiredField, etc.
labels.tables.*      // Name, Status, CreatedDate, Actions, etc.
labels.charts.*      // Revenue, Growth, Monthly, etc.
labels.billing.*     // Invoice, Subscription, Amount, etc.
labels.distribution.*     // Distribution-specific labels
labels.integrator.*       // Integrator-specific labels
labels.customer.*         // Customer-specific labels
labels.orders.*           // Order-specific labels
labels.onboardingSteps.*  // Onboarding flow labels
labels.reports.*          // Reports page labels
```

---

## 🚀 AUTOMATED AUDIT TOOLS

### Run audit in browser console:

```javascript
// Full audit - finds all hardcoded strings
window.__i18nAudit.auditHardcodedStrings()

// Scan only for Hebrew strings
window.__i18nAudit.scanForHebrewStrings()

// Scan only for English UI strings
window.__i18nAudit.scanForEnglishUIStrings()

// Check for missing translation keys
window.__i18nAudit.checkMissingKeys()
```

### Example output:
```
🔍 Starting i18n audit...

📊 AUDIT RESULTS:
Hebrew strings found: 45
English UI strings found: 78

🔴 HEBREW STRINGS (should use tr helper):
  1. [DIV] "סטטוס הגנה"
     Element: <div class="status">
  ...
```

---

## ✅ VERIFICATION CHECKLIST

### Before claiming completion:

- [ ] All three layouts use labels.js
- [ ] All navigation items use labels
- [ ] All buttons use labels (Create, Save, Cancel, etc.)
- [ ] All status badges use labels
- [ ] All empty states use labels
- [ ] All error messages use labels
- [ ] All placeholder text uses labels
- [ ] All table headers use labels
- [ ] All form labels use labels
- [ ] All tooltips use labels
- [ ] No Hebrew text outside labels.js except brand names (CData, FortiSASE, Perception Point, Gmail, Microsoft 365)
- [ ] No common English UI words outside labels.js (Dashboard, Settings, Create, Save, etc.)
- [ ] RTL/LTR class applied correctly (check: `<html class="rtl">` or `<html class="ltr">`)
- [ ] Sidebar position changes with RTL (right in Hebrew, left in English)
- [ ] Text alignment follows language direction
- [ ] All borders/padding/margins use logical CSS
- [ ] Browser console audit shows 0 hardcoded strings

---

## 📝 ADDING NEW LABELS

### If a label doesn't exist:

1. **Add to `src/i18n/labels.js`:**
   ```javascript
   myNewLabel: tr('טקסט עברי', 'English text'),
   ```

2. **Use in component:**
   ```javascript
   const labels = getCommonLabels(tr)
   // Then use: labels.section.myNewLabel
   ```

3. **Organize by category:**
   - Navigation items → `labels.navigation`
   - Action buttons → `labels.actions`
   - Status values → `labels.statuses`
   - Page-specific → `labels.distributorDashboard`, `labels.customerSecurity`, etc.

---

## 🎯 RTL CSS GUIDELINES

### Use these patterns for RTL compatibility:

```css
/* Flexbox with RTL support */
.flex.rtl:flex-row-reverse

/* Borders */
.border-r.rtl:border-r-0.rtl:border-l

/* Padding/Margins */
.pr-4.rtl:pr-0.rtl:pl-4
.ml-2.rtl:ml-0.rtl:mr-2

/* Text alignment */
.text-left.rtl:text-right
.text-right.rtl:text-left

/* Icons that point (e.g., arrows) */
.rtl:rotate-180  /* For back/next arrows */

/* Sidebar position */
.rtl:right-auto.rtl:left-0  /* Switch from right to left */
```

### Tailwind shortcuts already available:
```
rtl:  - applies only in RTL mode
ltr:  - applies only in LTR mode
```

---

## 🔄 TESTING STRATEGY

### Test each portal:
1. Switch language to Hebrew
2. Verify all text is Hebrew
3. Verify layout is RTL (sidebar on right)
4. Verify text alignment is right
5. Switch to English
6. Verify all text is English
7. Verify layout is LTR (sidebar on left)
8. Verify text alignment is left
9. Run audit tool - should show 0 hardcoded strings

---

## 📞 SUPPORT

### If you find issues:
1. Run `window.__i18nAudit.auditHardcodedStrings()`
2. Update the file(s) that appear in results
3. Refresh and run audit again
4. Re-test in both languages

---

## NEXT STEPS

1. **Start with Tier 1 files** (critical paths)
2. **Use the pattern** shown above for each file
3. **Run audit** after updating key pages
4. **Test both languages** thoroughly
5. **Move to Tier 2, 3, 4** files
6. **Final verification** when all files are updated

**Estimated effort:** 2-3 hours for one person to complete all remaining files
**Priority:** Focus on Tier 1 first - these are what users see most
