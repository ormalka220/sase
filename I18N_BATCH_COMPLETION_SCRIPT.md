# BATCH i18n COMPLETION SCRIPT
**Goal:** Complete all remaining 44 files in under 1 hour using find-and-replace patterns

---

## ✅ COMPLETED (DEMO-READY)

### Infrastructure (100%)
- ✅ `src/i18n/labels.js` - 700+ translation keys
- ✅ `src/context/LanguageContext.jsx` - RTL/LTR support
- ✅ `src/i18n/auditHelper.js` - Development tools
- ✅ `src/App.jsx` - Audit initialization

### Layouts (100% - VISIBLE IN DEMO)
- ✅ `src/layouts/DistributorLayout.jsx`
- ✅ `src/layouts/IntegratorLayout.jsx`
- ✅ `src/layouts/CustomerLayout.jsx`

### Pages (PARTIALLY DONE)
- ✅ `src/pages/distributor/Dashboard.jsx` - FULLY UPDATED
- ⚠️ `src/pages/integrator/Dashboard.jsx` - 80% UPDATED
- ⚠️ `src/pages/customer/Overview.jsx` - 30% UPDATED

### Shared Components (PARTIALLY DONE)
- ⚠️ `src/components/ProductSwitch.jsx` - UPDATED
- ⚠️ `src/components/StateViews.jsx` - UPDATED
- ⚠️ `src/components/LanguageSwitch.jsx` - MINIMAL UPDATE NEEDED

---

## 🚀 RAPID BATCH COMPLETION PROCESS

### STEP 1: Auto-Update Pattern Replacements
Use your IDE's find-and-replace (Ctrl+H / Cmd+H) with REGEX to fix 60% of hardcoded strings:

#### Pattern 1: English Dashboard/Settings/Orders labels
**Find:** `label="([^"]*)(Dashboard|Settings|Orders|Reports|Billing|Onboarding|Customers|Integrators)([^"]*)"`
**Replace with:** `label={labels.navigation.$2.toLowerCase()}`
**Note:** Requires manual review but catches 30% of strings

#### Pattern 2: Simple tr() wrapper
**Find:** `>([A-Z][^<]*)</`  (captures capitalized words in JSX)
**Replace:** Check each match and wrap: `>{tr('HEBREW', '$1')}</`
**Note:** Semi-automatic, needs manual Hebrew text

#### Pattern 3: Status labels
**Find:** `"(Active|Pending|Approved|Rejected|Failed|Cancelled|Suspended)"`
**Replace:** `labels.statuses.$1.toLowerCase()`

#### Pattern 4: Common actions
**Find:** `"(Create|Save|Cancel|Delete|Edit|Submit|Approve|Reject)"`
**Replace:** `labels.actions.$1.toLowerCase()`

---

## 🎯 PRIORITY FILE ORDER (Complete in this order)

### Tier 1: VISIBLE IN DEMO (8 files) - DO FIRST
These are what demo viewers will see:
1. `src/pages/distributor/IntegratorsList.jsx` - List UI
2. `src/pages/distributor/OrdersApproval.jsx` - Approval UI
3. `src/pages/distributor/Settings.jsx` - Settings page
4. `src/pages/integrator/CustomersList.jsx` - List UI
5. `src/pages/integrator/CreateCustomer.jsx` - Form UI
6. `src/pages/customer/Security.jsx` - Dashboard section
7. `src/pages/customer/Devices.jsx` - List UI
8. `src/pages/customer/Billing.jsx` - Billing UI

### Tier 2: SUPPORTING COMPONENTS (6 files)
These appear on demo pages:
1. `src/components/distribution/ApprovalQueuePreview.jsx`
2. `src/components/distribution/OnboardingHealthSection.jsx`
3. `src/components/distribution/RevenueChartsSection.jsx`
4. `src/components/distribution/OrderCard.jsx`
5. `src/components/OnboardingChecklist.jsx`
6. `src/components/OrderTimeline.jsx`

### Tier 3: OTHER PAGES (30 files)
Complete with batch automated approach:
- All remaining pages in `src/pages/`

---

## 📋 TEMPLATE FOR EACH FILE (Copy & Paste)

```jsx
// 1. ADD IMPORT at top
import { useLanguage } from '../context/LanguageContext'
import { getCommonLabels } from '../i18n/labels'

// 2. IN COMPONENT FUNCTION
const { tr } = useLanguage()
const labels = getCommonLabels(tr)

// 3. REPLACE STRINGS
// Instead of:  label="Create"
// Use:         label={labels.actions.create}

// Instead of: "טיוטה"
// Use:        labels.statuses.draft

// Instead of: tr('טקסט', 'English')
// Use:        labels.category.key  (if key exists in labels.js)
```

---

## 🔄 QUICK BATCH REPLACEMENT GUIDE

### For Each Tier 1 File:

```bash
# 1. Open file in IDE
# 2. Add imports (3 lines)
# 3. Initialize labels in component (2 lines)
# 4. Use Find & Replace (Ctrl+H) for patterns:

Find: "Create"                    → Replace: {labels.actions.create}
Find: "Save"                      → Replace: {labels.actions.save}
Find: "Cancel"                    → Replace: {labels.actions.cancel}
Find: "Dashboard"                 → Replace: {labels.navigation.dashboard}
Find: "Customers"                 → Replace: {labels.navigation.customers}
Find: "Orders"                    → Replace: {labels.navigation.orders}
Find: "Active"                    → Replace: {labels.statuses.active}
Find: "Pending"                   → Replace: {labels.statuses.pending}
Find: "טיוטה"                     → Replace: {labels.statuses.draft}
Find: "אבטחה"                     → Replace: {labels.navigation.security}
Find: "הגדרות"                    → Replace: {labels.navigation.settings}

# 5. Test in Hebrew/English
# 6. Commit
```

---

## 🚨 CRITICAL STRINGS TO VERIFY

After completing each file, search for these common strings that MUST be translated:

**English hardcodes to find:**
```
"Dashboard"
"Settings"
"Create"
"Save"
"Cancel"
"Customers"
"Orders"
"Active"
"Pending"
"Approved"
"Rejected"
"No data"
"Loading"
"Error"
```

**Hebrew hardcodes to find:**
```
"סטטוס"
"לוח בקרה"
"שמור"
"בטל"
"לקוחות"
"הזמנות"
"פעיל"
"ממתין"
"טיוטה"
```

---

## ⚡ AUTOMATED COMPLETION (If using IDE extension)

If your IDE supports regex replace:

### Mass Replace Command 1
```
Find:    <>(Create|Save|Cancel|Delete|Edit|Submit)</
Replace: >{labels.actions.$1.toLowerCase()}</
Apply:   All files in src/pages/
```

### Mass Replace Command 2
```
Find:    label="(Create|Save|Cancel|Delete|Edit)"
Replace: label={labels.actions.$1.toLowerCase()}
Apply:   All components
```

### Mass Replace Command 3
```
Find:    (Active|Pending|Approved|Rejected)
Replace: labels.statuses.$1.toLowerCase()
Apply:   All files
```

---

## ✅ VERIFICATION CHECKLIST

After completing each file:

- [ ] Added imports: `useLanguage`, `getCommonLabels`
- [ ] Added: `const { tr } = useLanguage()`
- [ ] Added: `const labels = getCommonLabels(tr)`
- [ ] Replaced ALL English UI strings with `labels.*.*`
- [ ] Replaced ALL `tr('he', 'en')` patterns with `labels.*.key` WHERE KEY EXISTS
- [ ] No hardcoded English words remain (except brand names: CData, FortiSASE, Perception Point, Gmail, Microsoft 365)
- [ ] No hardcoded Hebrew characters remain outside labels
- [ ] Tested in Hebrew mode
- [ ] Tested in English mode

---

## 🧪 FINAL AUDIT

Run in browser console:
```javascript
window.__i18nAudit.auditHardcodedStrings()
```

**Must return:** 0 hardcoded Hebrew strings, 0 hardcoded English UI strings

---

## ⏱️ TIME ESTIMATE

- **Tier 1** (8 files): 20-30 minutes with batch find-replace
- **Tier 2** (6 files): 15-20 minutes  
- **Tier 3** (30 files): 20-30 minutes with automation
- **Testing**: 10-15 minutes

**TOTAL:** ~1 hour for experienced developer, ~2 hours for careful review

---

## 🎓 EXAMPLE: Complete a File in 2 Minutes

### BEFORE (Hardcoded):
```jsx
export default function MyComponent() {
  const { isHebrew } = useLanguage()
  return (
    <div>
      <h1>{isHebrew ? 'לוח בקרה' : 'Dashboard'}</h1>
      <button>Create Customer</button>
      <div>סטטוס: {isHebrew ? 'פעיל' : 'Active'}</div>
    </div>
  )
}
```

### AFTER (Translated):
```jsx
import { useLanguage } from '../context/LanguageContext'
import { getCommonLabels } from '../i18n/labels'

export default function MyComponent() {
  const { tr } = useLanguage()
  const labels = getCommonLabels(tr)
  return (
    <div>
      <h1>{labels.navigation.dashboard}</h1>
      <button>{labels.actions.create} {labels.portals.customer}</button>
      <div>{tr('סטטוס', 'Status')}: {labels.statuses.active}</div>
    </div>
  )
}
```

---

## 📞 SUPPORT

If a label key doesn't exist in `src/i18n/labels.js`:
1. **DON'T** add tr() - it will show [MISSING:key]
2. **INSTEAD**: Add the missing key to labels.js FIRST
3. Then use it in the component

Missing key format:
```javascript
// In labels.js, add under appropriate category:
myNewKey: tr('טקסט עברי', 'English text'),
```

---

## 🎯 FOR DEMO TOMORROW

**MINIMUM TO COMPLETE FOR DEMO:**
1. ✅ Complete Tier 1 files (8 critical pages) - MUST DO
2. ✅ Complete Tier 2 files (6 components) - SHOULD DO
3. ⚠️ Tier 3 files - NICE TO HAVE

**If short on time:**
- Focus on pages/components that appear in main demo flow
- Skip internal/hidden pages temporarily
- Audit only the pages being demo'd

---

## 🚀 START NOW

1. Open `src/pages/distributor/IntegratorsList.jsx`
2. Add 2 imports (30 seconds)
3. Add 2 lines to component (10 seconds)
4. Find & Replace hardcoded strings (2 minutes per file)
5. Test in both languages (1 minute)
6. Repeat for next 13 files

**You can complete this in 30-45 minutes with focused work!**

---

Done properly, your app will be:
✅ 100% Hebrew in Hebrew mode
✅ 100% English in English mode  
✅ Full RTL/LTR layout switching
✅ Production-ready for demo
