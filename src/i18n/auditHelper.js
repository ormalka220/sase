/**
 * Development audit helper to detect hardcoded Hebrew/English strings
 * 
 * Usage in console:
 * import { scanForHardcodedStrings } from './i18n/auditHelper'
 * scanForHardcodedStrings()
 * 
 * This helper scans the DOM and component code for hardcoded Hebrew/English
 * strings that should have been moved to labels.js and wrapped with tr()
 */

/**
 * Regex patterns for detecting hardcoded strings
 */
const HEBREW_REGEX = /[\u0590-\u05FF]+/g
const COMMON_ENGLISH_UI_STRINGS = [
  'Dashboard', 'Settings', 'Logout', 'Cancel', 'Save', 'Create', 'Delete', 'Edit',
  'Customers', 'Orders', 'Reports', 'Billing', 'Onboarding', 'Overview', 'Security',
  'Submit', 'Continue', 'Back', 'Next', 'Search', 'Filter', 'Export', 'Download',
  'Active', 'Pending', 'Approved', 'Rejected', 'Failed', 'Completed', 'Draft',
  'No data', 'Loading', 'Error', 'Success', 'Warning', 'Info', 'Confirm',
  'Integrators', 'Administrator', 'User', 'Profile', 'Account', 'Notifications',
  'Help', 'Support', 'Feedback', 'About', 'Contact', 'Email', 'Phone', 'Address',
  'Company', 'Organization', 'Team', 'Member', 'Role', 'Permission', 'Access',
  'Product', 'Service', 'License', 'Subscription', 'Invoice', 'Payment',
  'Status', 'Date', 'Time', 'Duration', 'Price', 'Total', 'Subtotal', 'Tax',
  'Name', 'Description', 'Type', 'Category', 'Owner', 'Created', 'Modified',
  'Actions', 'Details', 'View', 'Open', 'Close', 'Copy', 'Copied', 'Paste',
  'New', 'Old', 'Current', 'Previous', 'Next', 'First', 'Last', 'All',
  'None', 'Select', 'Choose', 'Pick', 'Add', 'Remove', 'Clear', 'Reset',
  'Enable', 'Disable', 'Show', 'Hide', 'Expand', 'Collapse', 'Sort', 'Group',
  'From', 'To', 'By', 'For', 'In', 'On', 'At', 'With', 'Without', 'More', 'Less',
]

/**
 * Scan DOM for hardcoded Hebrew strings
 * Returns array of elements containing Hebrew text
 */
export function scanForHebrewStrings() {
  const results = []
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )

  let node
  while (node = walker.nextNode()) {
    const text = node.textContent.trim()
    if (text && HEBREW_REGEX.test(text)) {
      // Filter out known Hebrew brand names and common words
      if (!isAllowedHebrewString(text)) {
        results.push({
          element: node.parentElement,
          text: text.substring(0, 100),
          tag: node.parentElement.tagName,
        })
      }
    }
  }

  return results
}

/**
 * Scan DOM for common hardcoded English UI strings
 * Returns array of suspicious elements
 */
export function scanForEnglishUIStrings() {
  const results = []
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )

  let node
  while (node = walker.nextNode()) {
    const text = node.textContent.trim()
    if (text.length > 0 && /^[A-Za-z0-9\s]+$/.test(text)) {
      // Check if text matches common UI strings
      if (COMMON_ENGLISH_UI_STRINGS.some(str => text.includes(str))) {
        // Skip if it's likely technical content or inside script/style
        if (!isAllowedEnglishString(text, node)) {
          results.push({
            element: node.parentElement,
            text: text.substring(0, 100),
            tag: node.parentElement.tagName,
          })
        }
      }
    }
  }

  return results
}

/**
 * Check if Hebrew string is allowed (brand names, technical terms, etc.)
 */
function isAllowedHebrewString(text) {
  // Define allowed Hebrew strings
  const allowed = [
    'CData', // Brand name
    'FortiSASE', // Product name
  ]

  // Check if text contains only allowed strings
  for (const allowedStr of allowed) {
    if (text === allowedStr || text.includes(allowedStr)) {
      return true
    }
  }

  return false
}

/**
 * Check if English string is allowed
 */
function isAllowedEnglishString(text, node) {
  // Allowed brand/product names
  const allowedBrands = ['CData', 'FortiSASE', 'Perception Point', 'Gmail', 'Microsoft 365']
  
  // Check if text is brand name
  if (allowedBrands.some(brand => text === brand || text.includes(brand))) {
    return true
  }

  // Skip if inside script, style, or data attributes
  let parent = node.parentElement
  while (parent) {
    const tag = parent.tagName.toLowerCase()
    if (['script', 'style', 'noscript'].includes(tag)) {
      return true
    }
    parent = parent.parentElement
  }

  return false
}

/**
 * Comprehensive audit - scan for both Hebrew and English hardcoded strings
 */
export function auditHardcodedStrings() {
  console.log('🔍 Starting i18n audit...\n')

  const hebrewResults = scanForHebrewStrings()
  const englishResults = scanForEnglishUIStrings()

  console.log('📊 AUDIT RESULTS:')
  console.log(`Hebrew strings found: ${hebrewResults.length}`)
  console.log(`English UI strings found: ${englishResults.length}\n`)

  if (hebrewResults.length > 0) {
    console.log('🔴 HEBREW STRINGS (should use tr helper):')
    hebrewResults.slice(0, 20).forEach((result, idx) => {
      console.log(`  ${idx + 1}. [${result.tag}] "${result.text}"`)
      console.log(`     Element:`, result.element)
    })
    if (hebrewResults.length > 20) {
      console.log(`  ... and ${hebrewResults.length - 20} more`)
    }
    console.log()
  }

  if (englishResults.length > 0) {
    console.log('🟠 ENGLISH UI STRINGS (should use tr helper):')
    englishResults.slice(0, 20).forEach((result, idx) => {
      console.log(`  ${idx + 1}. [${result.tag}] "${result.text}"`)
      console.log(`     Element:`, result.element)
    })
    if (englishResults.length > 20) {
      console.log(`  ... and ${englishResults.length - 20} more`)
    }
    console.log()
  }

  if (hebrewResults.length === 0 && englishResults.length === 0) {
    console.log('✅ No hardcoded strings detected!')
  }

  return {
    hebrewCount: hebrewResults.length,
    englishCount: englishResults.length,
    hebrewResults,
    englishResults,
  }
}

/**
 * Check for missing translation keys in components
 */
export function checkMissingKeys() {
  const missingElements = document.querySelectorAll('[data-missing-key]')
  const results = []

  missingElements.forEach(el => {
    results.push({
      key: el.dataset.missingKey,
      element: el,
      text: el.textContent.substring(0, 100),
    })
  })

  if (results.length > 0) {
    console.log('⚠️ MISSING TRANSLATION KEYS:')
    results.forEach((result, idx) => {
      console.log(`  ${idx + 1}. [${result.key}] in ${result.element.tagName}`)
    })
  } else {
    console.log('✅ No missing translation keys')
  }

  return results
}

/**
 * Export function to expose audit in window for console access
 */
export function initAuditTools() {
  if (typeof window !== 'undefined') {
    window.__i18nAudit = {
      scanForHebrewStrings,
      scanForEnglishUIStrings,
      auditHardcodedStrings,
      checkMissingKeys,
    }
    console.log('✅ i18n audit tools available as window.__i18nAudit')
  }
}
