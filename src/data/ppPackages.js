// Perception Point package catalog — pricing is per mailbox per month
// Annual billing applies a 15% discount on the monthly per-mailbox rate

export const PP_PACKAGES = [
  {
    id: 'pp-ades',
    code: 'ADES',
    name: 'Advanced Email Security',
    nameHe: 'אבטחת מייל מתקדמת',
    sku: 'FPP-ADES1-ST-AExx',
    description:
      'Advanced protection against phishing, BEC, malware, and malicious URLs for email only.',
    descriptionHe: 'הגנה מתקדמת נגד פישינג, BEC, קבצים וקישורים זדוניים — לאימייל בלבד.',
    features: [
      'Anti-phishing & BEC detection',
      'Malware & ransomware scanning',
      'Malicious URL rewriting',
      'DMARC / SPF / DKIM enforcement',
      'Threat analytics dashboard',
    ],
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    // Prices in USD per mailbox per month
    monthlyPricePerMailbox: 3.0,
    annualPricePerMailbox: 2.55, // 15% annual discount
    annualDiscountPct: 15,
  },
  {
    id: 'pp-emsb',
    code: 'EMSB',
    name: 'Email & MS Bundle Security',
    nameHe: 'חבילת מייל ו-Microsoft',
    sku: 'FPP-EMSB1-BD-BDxx',
    description:
      'Full protection for email plus Microsoft 365 collaboration — Teams, SharePoint, OneDrive.',
    descriptionHe: 'הגנה מלאה על אימייל וגם על Microsoft 365 (Teams, SharePoint, OneDrive).',
    features: [
      'Everything in Advanced Email Security',
      'Microsoft Teams protection',
      'SharePoint & OneDrive scanning',
      'Microsoft 365 consent integration',
      'Unified threat timeline',
    ],
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    monthlyPricePerMailbox: 5.0,
    annualPricePerMailbox: 4.25, // 15% annual discount
    annualDiscountPct: 15,
  },
]

export const PP_BILLING_CYCLES = [
  {
    id: 'MONTHLY',
    label: 'Monthly',
    labelHe: 'חודשי',
    description: 'Billed monthly per actual protected mailboxes',
    badge: null,
  },
  {
    id: 'ANNUAL',
    label: 'Annual',
    labelHe: 'שנתי',
    description: 'Billed annually — 15% savings vs monthly',
    badge: '15% חיסכון',
  },
]

export function calcPPEstimate(pkg, billingCycle, estimatedMailboxes) {
  if (!pkg || !estimatedMailboxes || estimatedMailboxes <= 0) return { monthly: 0, annual: 0 }
  const pricePerMailbox =
    billingCycle === 'ANNUAL' ? pkg.annualPricePerMailbox : pkg.monthlyPricePerMailbox
  const monthly = pricePerMailbox * estimatedMailboxes
  const annual = monthly * 12
  return { monthly, annual, pricePerMailbox }
}
