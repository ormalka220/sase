/**
 * Centralized translation labels for the entire application
 * IMPORTANT: Every visible UI string must use tr(key) and be defined here
 * Missing keys will render as [MISSING:key] for easy detection during development
 */

export function getCommonLabels(tr) {
  return {
    // ==================== NAVIGATION ====================
    navigation: {
      dashboard: tr('לוח בקרה', 'Dashboard'),
      customers: tr('לקוחות', 'Customers'),
      integrators: tr('אינטגרטורים', 'Integrators'),
      orders: tr('הזמנות', 'Orders'),
      onboarding: tr('קליטה', 'Onboarding'),
      billing: tr('חיוב', 'Billing'),
      reports: tr('דוחות', 'Reports'),
      settings: tr('הגדרות', 'Settings'),
      logout: tr('יציאה', 'Logout'),
      overview: tr('סקירה כללית', 'Overview'),
      security: tr('אבטחה', 'Security'),
      users: tr('משתמשים', 'Users'),
      devices: tr('התקנים', 'Devices'),
      sites: tr('אתרים', 'Sites'),
      policies: tr('מדיניות', 'Policies'),
      alerts: tr('התראות', 'Alerts'),
      licenses: tr('רישיונות', 'Licenses'),
      emailScan: tr('סריקת דוא"ל', 'Email Scan'),
      threats: tr('איומים', 'Threats'),
    },

    // ==================== PORTAL LABELS ====================
    portals: {
      distribution: tr('הפצה', 'Distribution'),
      distributionHub: tr('מרכז הפצה', 'Distribution Hub'),
      distributionPortal: tr('פורטל מפיץ', 'Distributor Portal'),
      integrator: tr('אינטגרטור', 'Integrator'),
      integrators: tr('אינטגרטורים', 'Integrators'),
      integratorPortal: tr('פורטל אינטגרטור', 'Integrator Portal'),
      customer: tr('לקוח', 'Customer'),
      customers: tr('לקוחות', 'Customers'),
      customerPortal: tr('פורטל לקוח', 'Customer Portal'),
    },

    // ==================== ACTIONS ====================
    actions: {
      create: tr('צור', 'Create'),
      update: tr('עדכן', 'Update'),
      save: tr('שמור', 'Save'),
      cancel: tr('בטל', 'Cancel'),
      approve: tr('אשר', 'Approve'),
      reject: tr('דחה', 'Reject'),
      submit: tr('שלח', 'Submit'),
      continue: tr('המשך', 'Continue'),
      back: tr('חזור', 'Back'),
      next: tr('הבא', 'Next'),
      search: tr('חיפוש', 'Search'),
      filter: tr('סנן', 'Filter'),
      export: tr('ייצוא', 'Export'),
      download: tr('הורדה', 'Download'),
      copy: tr('העתק', 'Copy'),
      copied: tr('הועתק', 'Copied'),
      open: tr('פתח', 'Open'),
      close: tr('סגור', 'Close'),
      openPortal: tr('פתח פורטל', 'Open Portal'),
      edit: tr('ערוך', 'Edit'),
      delete: tr('מחק', 'Delete'),
      add: tr('הוסף', 'Add'),
      remove: tr('הסר', 'Remove'),
      view: tr('צפה', 'View'),
      viewDetails: tr('צפה בפרטים', 'View Details'),
      sendInvite: tr('שלח הזמנה', 'Send Invite'),
      inviteAdmin: tr('הזמן אדמין', 'Invite Admin'),
      connect: tr('התחבר', 'Connect'),
      disconnect: tr('התנתק', 'Disconnect'),
      retry: tr('נסה שוב', 'Retry'),
      tryAgain: tr('נסה שוב', 'Try Again'),
      confirm: tr('אישור', 'Confirm'),
      resend: tr('שלח שוב', 'Resend'),
    },

    // ==================== PRODUCTS ====================
    products: {
      allProducts: tr('כל המוצרים', 'All Products'),
      perceptionPoint: 'Perception Point',
      fortiSASE: 'FortiSASE',
      workspaceSecurity: 'Perception Point',
      sase: 'SASE',
    },

    // ==================== STATUSES ====================
    statuses: {
      active: tr('פעיל', 'Active'),
      inactive: tr('לא פעיל', 'Inactive'),
      pending: tr('ממתין', 'Pending'),
      pendingApproval: tr('ממתין לאישור', 'Pending Approval'),
      approved: tr('אושר', 'Approved'),
      rejected: tr('נדחה', 'Rejected'),
      provisioning: tr('בהקמה', 'Provisioning'),
      provisioned: tr('הוקם', 'Provisioned'),
      onboarding: tr('בתהליך קליטה', 'Onboarding'),
      completed: tr('הסתיים', 'Completed'),
      failed: tr('נכשל', 'Failed'),
      draft: tr('טיוטה', 'Draft'),
      cancelled: tr('בוטל', 'Cancelled'),
      suspended: tr('מושהה', 'Suspended'),
      connected: tr('מחובר', 'Connected'),
      notConnected: tr('לא מחובר', 'Not Connected'),
      actionRequired: tr('נדרשת פעולה', 'Action Required'),
      waitingForCDataApproval: tr('ממתין לאישור CData', 'Waiting for CData Approval'),
      // Extended statuses
      DRAFT: tr('טיוטה', 'Draft'),
      PAYMENT_PENDING: tr('ממתין לתשלום', 'Payment Pending'),
      PENDING_APPROVAL: tr('ממתין לאישור', 'Pending Approval'),
      PENDING_CDATA_APPROVAL: tr('ממתין לאישור CData', 'Pending CData Approval'),
      PENDING_DISTRIBUTOR_APPROVAL: tr('ממתין לאישור מפיץ', 'Pending Distributor Approval'),
      ACTIVE: tr('פעיל', 'Active'),
      ONBOARDING: tr('בתהליך קליטה', 'Onboarding'),
      SUSPENDED: tr('מושהה', 'Suspended'),
      APPROVED: tr('אושר', 'Approved'),
      APPROVED_BY_CDATA: tr('אושר על ידי CData', 'Approved by CData'),
      REJECTED: tr('נדחה', 'Rejected'),
      REJECTED_BY_CDATA: tr('נדחה על ידי CData', 'Rejected by CData'),
      FAILED: tr('נכשל', 'Failed'),
      PROVISIONING: tr('בהקמה', 'Provisioning'),
      PROVISIONING_STARTED: tr('הקמה התחילה', 'Provisioning Started'),
      PROVISIONED: tr('הוקם', 'Provisioned'),
      PP_ORG_CREATED: tr('ארגון PP נוצר', 'PP Organization Created'),
      PP_ADMIN_INVITED: tr('משתמש אדמין הוזמן', 'PP Admin Invited'),
      INTEGRATION_IN_PROGRESS: tr('אינטגרציה בתהליך', 'Integration in Progress'),
      READY_FOR_ONBOARDING: tr('מוכן לקליטה', 'Ready for Onboarding'),
      ONBOARDING_PENDING: tr('ממתין לקליטה', 'Onboarding Pending'),
      CANCELLED: tr('בוטל', 'Cancelled'),
    },

    // ==================== PERCEPTION POINT BUSINESS TEXT ====================
    ppBusiness: {
      estimatedProtectedMailboxes: tr('תיבות דוא"ל מוגנות משוערות', 'Estimated Protected Mailboxes'),
      priceEstimate: tr('הערכת מחיר', 'Price Estimate'),
      invoiceOnly: tr('חשבונית בלבד', 'Invoice Only'),
      noCreditCard: tr('לא נדרשת כרטיס אשראי', 'No Credit Card Required'),
      finalBillingByActualMailboxes: tr('חיוב סופי לפי תיבות דוא"ל בפועל', 'Final Billing by Actual Mailboxes'),
      submitToCDataApproval: tr('שלח לאישור CData', 'Submit to CData Approval'),
      adminInvited: tr('אדמין הוזמן', 'Admin Invited'),
      organizationCreated: tr('ארגון נוצר', 'Organization Created'),
      readyForOnboarding: tr('מוכן לקליטה', 'Ready for Onboarding'),
      connectMicrosoft365: tr('התחבר ל-Microsoft 365', 'Connect to Microsoft 365'),
      connectGmail: tr('התחבר ל-Gmail', 'Connect to Gmail'),
      dnsMailFlowPending: tr('DNS/Mail Flow ממתין', 'DNS/Mail Flow Pending'),
      protectedMailboxes: tr('תיבות דוא"ל מוגנות', 'Protected Mailboxes'),
    },

    // ==================== FORMS ====================
    forms: {
      companyName: tr('שם החברה', 'Company Name'),
      contactName: tr('שם איש קשר', 'Contact Name'),
      contactEmail: tr('דוא"ל איש קשר', 'Contact Email'),
      phone: tr('טלפון', 'Phone'),
      domain: tr('דומיין', 'Domain'),
      country: tr('מדינה', 'Country'),
      notes: tr('הערות', 'Notes'),
      requiredField: tr('שדה נדרש', 'Required field'),
      invalidEmail: tr('דוא"ל לא תקין', 'Invalid email'),
      description: tr('תיאור', 'Description'),
      firstName: tr('שם פרטי', 'First Name'),
      lastName: tr('שם משפחה', 'Last Name'),
      email: tr('דוא"ל', 'Email'),
      password: tr('סיסמה', 'Password'),
      confirmPassword: tr('אשר סיסמה', 'Confirm Password'),
      select: tr('בחר', 'Select'),
      selectOption: tr('בחר אפשרות', 'Select Option'),
      enterValue: tr('הזן ערך', 'Enter Value'),
    },

    // ==================== EMPTY STATES ====================
    emptyStates: {
      noCustomers: tr('אין לקוחות', 'No Customers'),
      noOrders: tr('אין הזמנות', 'No Orders'),
      noInvoices: tr('אין חשבוניות', 'No Invoices'),
      noReports: tr('אין דוחות', 'No Reports'),
      noPendingApprovals: tr('אין אישורים ממתינים', 'No Pending Approvals'),
      noOnboardingCustomers: tr('אין לקוחות בקליטה', 'No Onboarding Customers'),
      noData: tr('אין נתונים', 'No Data'),
      noIntegrators: tr('אין אינטגרטורים', 'No Integrators'),
      noResults: tr('אין תוצאות', 'No Results'),
      tryAdjustingFilters: tr('נסה להתאים את המסננים', 'Try adjusting the filters'),
      getStarted: tr('בואו נתחיל', 'Get Started'),
    },

    // ==================== ERRORS ====================
    errors: {
      somethingWentWrong: tr('משהו השתבש', 'Something went wrong'),
      failedToLoad: tr('נכשל בטעינה', 'Failed to Load'),
      failedToSave: tr('נכשל בשמירה', 'Failed to Save'),
      failedToCreate: tr('נכשל בהיווצרות', 'Failed to Create'),
      failedToDelete: tr('נכשל במחיקה', 'Failed to Delete'),
      failedToUpdate: tr('נכשל בעדכון', 'Failed to Update'),
      errorLoadingData: tr('שגיאה בטעינת נתונים', 'Error Loading Data'),
      unauthorizedAccess: tr('גישה לא מורשית', 'Unauthorized Access'),
      notFound: tr('לא נמצא', 'Not Found'),
      invalidRequest: tr('בקשה לא תקינה', 'Invalid Request'),
    },

    // ==================== DISTRIBUTION PORTAL ====================
    distribution: {
      dashboardTitle: tr('לוח בקרה - הפצה', 'Distribution Dashboard'),
      dashboardSubtitle: tr('סקירה חיה של כל אינטגרטורים, לקוחות, הזמנות וקליטה', 'Live overview of all integrators, customers, orders, and onboarding'),
      integratorsTitle: tr('אינטגרטורים', 'Integrators'),
      createIntegrator: tr('צור אינטגרטור', 'Create Integrator'),
      integratorProfile: tr('פרטי אינטגרטור', 'Integrator Profile'),
      ordersTitle: tr('אישור הזמנות', 'Orders Approval'),
      channelManagement: tr('ניהול ערוץ', 'Channel Management'),
      channelManagementAndOrders: tr('ניהול ערוץ · הזמנות ואינטגרטורים', 'Channel Management · Orders & Integrators'),
      activeIntegrators: tr('אינטגרטורים פעילים', 'Active Integrators'),
      activeCustomers: tr('לקוחות פעילים', 'Active Customers'),
      totalOrders: tr('סה"כ הזמנות', 'Total Orders'),
      totalRevenue: tr('סה"כ הכנסות', 'Total Revenue'),
      orderRevenue: tr('הכנסה מהזמנות', 'Order Revenue'),
      avgOrderValue: tr('ממוצע ערך הזמנה', 'Average Order Value'),
      pendingOrders: tr('הזמנות ממתינות', 'Pending Orders'),
      approvalQueue: tr('תור אישור', 'Approval Queue'),
      onboardingHealth: tr('בריאות קליטה', 'Onboarding Health'),
      revenueCharts: tr('תרשימי הכנסות', 'Revenue Charts'),
      activityFeed: tr('עדכוני פעילות', 'Activity Feed'),
    },

    // ==================== INTEGRATOR PORTAL ====================
    integrator: {
      dashboardTitle: tr('לוח בקרה - אינטגרטור', 'Integrator Dashboard'),
      customersTitle: tr('לקוחות', 'Customers'),
      createCustomer: tr('צור לקוח', 'Create Customer'),
      customerProfile: tr('פרטי לקוח', 'Customer Profile'),
      ordersTitle: tr('הזמנות', 'Orders'),
      createOrder: tr('צור הזמנה', 'Create Order'),
      orderDetails: tr('פרטי הזמנה', 'Order Details'),
      billingTitle: tr('חיוב', 'Billing'),
      reportsTitle: tr('דוחות', 'Reports'),
      settingsTitle: tr('הגדרות', 'Settings'),
      onboardingTitle: tr('קליטה', 'Onboarding'),
      myCustomers: tr('הלקוחות שלי', 'My Customers'),
      myOrders: tr('ההזמנות שלי', 'My Orders'),
      activeCustomersCount: tr('לקוחות פעילים', 'Active Customers'),
      ordersInProgress: tr('הזמנות בתהליך', 'Orders in Progress'),
      pendingOnboarding: tr('ממתינים לקליטה', 'Pending Onboarding'),
    },

    // ==================== CUSTOMER PORTAL ====================
    customer: {
      overviewTitle: tr('סקירה כללית', 'Overview'),
      securityTitle: tr('אבטחה', 'Security'),
      onboardingTitle: tr('קליטה', 'Onboarding'),
      billingTitle: tr('חיוב', 'Billing'),
      reportsTitle: tr('דוחות', 'Reports'),
      usersTitle: tr('משתמשים', 'Users'),
      devicesTitle: tr('התקנים', 'Devices'),
      sitesTitle: tr('אתרים', 'Sites'),
      policiesTitle: tr('מדיניות', 'Policies'),
      alertsTitle: tr('התראות', 'Alerts'),
      licensesTitle: tr('רישיונות', 'Licenses'),
      threatsTitle: tr('איומים', 'Threats'),
      emailScanTitle: tr('סריקת דוא"ל', 'Email Scan'),
      myOrganization: tr('הארגון שלי', 'My Organization'),
      protectionStatus: tr('מצב הגנה', 'Protection Status'),
      healthStatus: tr('מצב בריאות', 'Health Status'),
    },

    // ==================== GENERIC UI ====================
    ui: {
      loading: tr('טוען...', 'Loading...'),
      saving: tr('שומר...', 'Saving...'),
      deleting: tr('מוחק...', 'Deleting...'),
      searching: tr('מחפש...', 'Searching...'),
      noInternet: tr('אין חיבור אינטרנט', 'No Internet Connection'),
      retry: tr('נסה שוב', 'Retry'),
      confirm: tr('אישור', 'Confirm'),
      confirmDelete: tr('האם אתה בטוח שברצונך למחוק?', 'Are you sure you want to delete?'),
      confirmAction: tr('האם אתה בטוח?', 'Are you sure?'),
      warning: tr('אזהרה', 'Warning'),
      info: tr('מידע', 'Info'),
      success: tr('הצלחה', 'Success'),
      error: tr('שגיאה', 'Error'),
      poweredBy: tr('מופעל על ידי', 'Powered by'),
      channel: tr('ערוץ', 'Channel'),
    },

    // ==================== BREADCRUMBS & BREADCRUMB CONTEXT ====================
    breadcrumbs: {
      home: tr('בית', 'Home'),
      back: tr('חזור', 'Back'),
    },

    // ==================== TOOLTIPS ====================
    tooltips: {
      clickToCopy: tr('לחץ להעתקה', 'Click to copy'),
      hoverForMore: tr('עבור על הערך למידע נוסף', 'Hover for more'),
      newWindow: tr('פתח בחלון חדש', 'Open in new window'),
    },

    // ==================== TABLES ====================
    tables: {
      name: tr('שם', 'Name'),
      email: tr('דוא"ל', 'Email'),
      status: tr('מצב', 'Status'),
      createdDate: tr('תאריך יצירה', 'Created Date'),
      updatedDate: tr('תאריך עדכון', 'Updated Date'),
      actions: tr('פעולות', 'Actions'),
      id: tr('מזהה', 'ID'),
      type: tr('סוג', 'Type'),
      contact: tr('איש קשר', 'Contact'),
      phone: tr('טלפון', 'Phone'),
      location: tr('מיקום', 'Location'),
      organization: tr('ארגון', 'Organization'),
      role: tr('תפקיד', 'Role'),
      createdBy: tr('נוצר על ידי', 'Created By'),
      lastModified: tr('שונה לאחרונה', 'Last Modified'),
      entries: tr('רשומות', 'Entries'),
      showing: tr('מציג', 'Showing'),
      of: tr('מתוך', 'of'),
      to: tr('עד', 'to'),
    },

    // ==================== MODALS & DIALOGS ====================
    modals: {
      confirmDelete: tr('אשר מחיקה', 'Confirm Delete'),
      confirmSubmit: tr('אשר שליחה', 'Confirm Submit'),
      unsavedChanges: tr('יש שינויים שלא שמורים', 'Unsaved Changes'),
      discardChanges: tr('הסר שינויים', 'Discard Changes'),
      saveChanges: tr('שמור שינויים', 'Save Changes'),
    },

    // ==================== CHART LABELS ====================
    charts: {
      revenue: tr('הכנסות', 'Revenue'),
      orders: tr('הזמנות', 'Orders'),
      customers: tr('לקוחות', 'Customers'),
      growth: tr('גדילה', 'Growth'),
      trend: tr('מגמה', 'Trend'),
      daily: tr('יומי', 'Daily'),
      monthly: tr('חודשי', 'Monthly'),
      yearly: tr('שנתי', 'Yearly'),
      byProduct: tr('לפי מוצר', 'By Product'),
      byRegion: tr('לפי אזור', 'By Region'),
      byIntegrator: tr('לפי אינטגרטור', 'By Integrator'),
    },

    // ==================== VALIDATION ====================
    validation: {
      required: tr('נדרש', 'Required'),
      invalidEmail: tr('דוא"ל לא תקין', 'Invalid email'),
      invalidPhone: tr('טלפון לא תקין', 'Invalid phone'),
      passwordTooShort: tr('הסיסמה קצרה מדי', 'Password too short'),
      passwordMismatch: tr('הסיסמאות לא תואמות', 'Passwords do not match'),
      minLength: tr('אורך מינימלי', 'Minimum length'),
      maxLength: tr('אורך מקסימלי', 'Maximum length'),
      fieldAlreadyExists: tr('הערך כבר קיים', 'Value already exists'),
    },

    // ==================== ONBOARDING FLOW ====================
    onboarding: {
      step1: tr('שלב 1', 'Step 1'),
      step2: tr('שלב 2', 'Step 2'),
      step3: tr('שלב 3', 'Step 3'),
      step4: tr('שלב 4', 'Step 4'),
      step5: tr('שלב 5', 'Step 5'),
      stepOne: tr('צור ארגון', 'Create Organization'),
      stepTwo: tr('הזמן אדמין', 'Invite Admin'),
      stepThree: tr('התחבר למוקדי דוא"ל', 'Connect Email Services'),
      stepFour: tr('הגדר MX Records', 'Configure MX Records'),
      stepFive: tr('סיים קליטה', 'Complete Onboarding'),
      getStarted: tr('בואו נתחיל', 'Get Started'),
      startOnboarding: tr('התחל קליטה', 'Start Onboarding'),
      completeOnboarding: tr('השלם קליטה', 'Complete Onboarding'),
      skip: tr('דלג', 'Skip'),
    },

    // ==================== DATE & TIME ====================
    dateTime: {
      today: tr('היום', 'Today'),
      yesterday: tr('אתמול', 'Yesterday'),
      thisWeek: tr('השבוע הזה', 'This Week'),
      thisMonth: tr('החודש הזה', 'This Month'),
      lastMonth: tr('החודש שעבר', 'Last Month'),
      thisYear: tr('השנה הזו', 'This Year'),
      lastYear: tr('השנה שעברה', 'Last Year'),
      allTime: tr('כל הזמן', 'All Time'),
      from: tr('מ', 'From'),
      to: tr('ל', 'To'),
    },

    // ==================== PAGINATION ====================
    pagination: {
      previous: tr('הקודם', 'Previous'),
      next: tr('הבא', 'Next'),
      first: tr('ראשון', 'First'),
      last: tr('אחרון', 'Last'),
      page: tr('עמוד', 'Page'),
      of: tr('מתוך', 'of'),
    },

    // ==================== BILLING ====================
    billing: {
      invoice: tr('חשבונית', 'Invoice'),
      invoices: tr('חשבוניות', 'Invoices'),
      subscription: tr('מנוי', 'Subscription'),
      subscriptions: tr('מנויים', 'Subscriptions'),
      amount: tr('סכום', 'Amount'),
      total: tr('סה"כ', 'Total'),
      subtotal: tr('סכום ביניים', 'Subtotal'),
      tax: tr('מס', 'Tax'),
      dueDate: tr('תאריך פדיון', 'Due Date'),
      paidDate: tr('תאריך תשלום', 'Paid Date'),
      paymentStatus: tr('מצב תשלום', 'Payment Status'),
      paid: tr('שולם', 'Paid'),
      unpaid: tr('לא שולם', 'Unpaid'),
      overdue: tr('באיחור', 'Overdue'),
      currency: tr('מטבע', 'Currency'),
      estimatePrice: tr('הערכה', 'Price Estimate'),
      finalBilling: tr('חיוב סופי', 'Final Billing'),
    },

    // ==================== PERMISSIONS & ROLES ====================
    roles: {
      superAdmin: tr('מנהל עליון', 'Super Admin'),
      distributorAdmin: tr('מנהל מפיץ', 'Distributor Admin'),
      integratorAdmin: tr('מנהל אינטגרטור', 'Integrator Admin'),
      customerAdmin: tr('מנהל לקוח', 'Customer Admin'),
      customerViewer: tr('צופה לקוח', 'Customer Viewer'),
      admin: tr('מנהל', 'Admin'),
      user: tr('משתמש', 'User'),
      viewer: tr('צופה', 'Viewer'),
    },

    // ==================== PAGE-SPECIFIC STRINGS ====================
    // Distributor Dashboard specific
    distributorDashboard: {
      title: tr('לוח בקרה הפצה', 'Distribution Dashboard'),
      subtitle: tr('סקירה חיה של כל הנתונים', 'Live overview of all data'),
      systemStatus: tr('מצב המערכת', 'System Status'),
      allServicesOperational: tr('כל השירותים פעילים', 'All services operational'),
      live: tr('חי', 'Live'),
      totalIntegrators: tr('סה"כ אינטגרטורים', 'Total Integrators'),
      totalCustomers: tr('סה"כ לקוחות', 'Total Customers'),
      pendingApprovals: tr('אישורים ממתינים', 'Pending Approvals'),
    },

    // Distributor Integrators List
    distributorIntegrators: {
      channelPartners: tr('שותפי ערוץ', 'Channel Partners'),
      createNewPartner: tr('צור שותף חדש', 'Create New Partner'),
      searchByNameOrEmail: tr('חיפוש לפי שם או דוא"ל', 'Search by name or email...'),
      noIntegratorsYet: tr('אין אינטגרטורים עדיין', 'No integrators yet'),
      noMatchingIntegrators: tr('אין אינטגרטורים תואמים', 'No matching integrators'),
    },

    // Integrator Dashboard specific
    integratorDashboard: {
      salesAndOpsHub: tr('מרכז מכירות ותפעול', 'Sales & Operations Hub'),
      activeCustomersCount: tr('לקוחות פעילים', 'Active Customers'),
      pendingOrdersCount: tr('הזמנות ממתינות', 'Pending Orders'),
      recentActivity: tr('פעילות אחרונה', 'Recent Activity'),
    },

    // Customer Dashboard / Overview
    customerDashboard: {
      organizationProtected: tr('הארגון מוגן ופעיל', 'Organization is protected and active'),
      overallSecurityScore: tr('ציון אבטחה כולל', 'Overall Security Score'),
      protectedUsers: tr('משתמשים מוגנים', 'Protected Users'),
      openAlerts: tr('התראות פתוחות', 'Open Alerts'),
      securityPostureDetails: tr('פירוט ציון אבטחה', 'Security Posture — Details'),
      emailProtectionStatus: tr('מצב הגנת דוא"ל', 'Email Protection Status'),
      allSystemsSecure: tr('כל המערכות מאובטחות ופועלות כראוי', 'All systems are secure and functioning normally'),
      allServicesActive: tr('כל השירותים פעילים', 'All services active'),
    },

    // Customer Security page
    customerSecurity: {
      protectionStatus: tr('מצב הגנה', 'Protection Status'),
      organizationHighlyProtected: tr('הארגון שלך מוגן ברמה גבוהה מאוד', 'Your organization is protected with high-level'),
      activeServices: tr('שירותים פעילים', 'Active Services'),
      openEvents: tr('אירועים פתוחים', 'Open Events'),
      complianceStatus: tr('עמידה בתקנים', 'Compliance Status'),
      emailSecurity: tr('אבטחת אימייל', 'Email Security'),
      browserSecurity: tr('אבטחת דפדפן', 'Browser Security'),
      sovereignSase: tr('SASE ריבוני', 'Sovereign SASE'),
    },

    // Customer Users/Devices/Sites
    customerUsers: {
      department: tr('מחלקה', 'Department'),
      threats: tr('איומים', 'Threats'),
    },

    customerDevices: {
      allDevices: tr('כל ההתקנים', 'All Devices'),
      windows: tr('Windows', 'Windows'),
      macOS: tr('macOS', 'macOS'),
      nonCompliant: tr('לא תקני', 'Non-Compliant'),
      compliant: tr('תקני', 'Compliant'),
      managed: tr('מנוהל', 'Managed'),
      unmanaged: tr('לא מנוהל', 'Unmanaged'),
      partial: tr('חלקי', 'Partial'),
      lowRisk: tr('סיכון נמוך', 'Low Risk'),
      mediumRisk: tr('סיכון בינוני', 'Medium Risk'),
      highRisk: tr('סיכון גבוה', 'High Risk'),
      lastSeen: tr('נצפה לאחרונה', 'Last Seen'),
    },

    // Reports and Analytics
    reports: {
      monthlySecurityReport: tr('דוח אבטחה חודשי', 'Monthly Security Report'),
      threatIntelligenceReport: tr('דוח Threat Intelligence', 'Threat Intelligence Report'),
      executiveReport: tr('דוח Executive', 'Executive Report'),
      phishing: 'Phishing',
      malware: 'Malware',
      bec: 'BEC',
      june: tr('יוני', 'June'),
      july: tr('יולי', 'July'),
      august: tr('אוגוסט', 'August'),
      september: tr('ספטמבר', 'September'),
      october: tr('אוקטובר', 'October'),
      november: tr('נובמבר', 'November'),
    },

    // Onboarding steps/progress
    onboardingSteps: {
      createOrganization: tr('צור ארגון', 'Create Organization'),
      inviteAdmin: tr('הזמן אדמין', 'Invite Admin'),
      connectEmailServices: tr('התחבר למוקדי דוא"ל', 'Connect Email Services'),
      configureMxRecords: tr('הגדר MX Records', 'Configure MX Records'),
      completeOnboarding: tr('השלם קליטה', 'Complete Onboarding'),
      organizationCreated: tr('ארגון נוצר', 'Organization Created'),
      adminInvited: tr('אדמין הוזמן', 'Admin Invited'),
      microsoftConnected: tr('Microsoft 365 מחובר', 'Microsoft 365 Connected'),
      gmailConnected: tr('Gmail מחובר', 'Gmail Connected'),
      ppOrgCreated: tr('ארגון PP נוצר', 'PP Organization Created'),
      mxRecordsPending: tr('DNS/Mail Flow ממתין', 'DNS/Mail Flow Pending'),
    },

    // Order related
    orders: {
      orderTimeline: tr('ציר זמן הזמנה', 'Order Timeline'),
      draft: tr('טיוטה', 'Draft'),
      submitted: tr('הוגש', 'Submitted'),
      paymentPending: tr('ממתין לתשלום', 'Payment Pending'),
      awaitingApproval: tr('ממתין לאישור', 'Awaiting Approval'),
      approved: tr('אושר', 'Approved'),
      provisioning: tr('בהקמה', 'Provisioning'),
      active: tr('פעיל', 'Active'),
      failed: tr('נכשל', 'Failed'),
      cancelled: tr('בוטל', 'Cancelled'),
      current: tr('נוכחי', 'CURRENT'),
      customer: tr('לקוח', 'Customer'),
      package: tr('חבילה', 'Package'),
      billingCycle: tr('מחזור חיוב', 'Billing Cycle'),
      billingMethod: tr('שיטת חיוב', 'Billing Method'),
      invoiceOnly: tr('חשבונית בלבד', 'Invoice Only'),
      usageBasedBilling: tr('חיוב על בסיס שימוש', 'Usage-Based Billing'),
      notesFromIntegrator: tr('הערות מהאינטגרטור', 'Notes from integrator'),
      estimatedUsers: tr('משתמשים משוערים', 'Est. Users'),
      estimatedAmount: tr('סכום משוער', 'Est. Amount'),
      approveOrder: tr('אשר הזמנה', 'Approve Order'),
      rejectOrder: tr('דחה הזמנה', 'Reject Order'),
      rejectionReason: tr('סיבת דחייה (חובה)', 'Rejection Reason (required)'),
      confirmRejection: tr('אשר דחייה', 'Confirm Rejection'),
      addInternalNote: tr('הוסף הערה פנימית (אופציונלי)', 'Add Internal Note (optional)'),
      confirmApproval: tr('אשר אישור', 'Confirm Approval'),
      orderSubmittedForApproval: tr('ההזמנה הוגשה לאישור CData', 'Order Submitted for CData Approval'),
      sku: tr('SKU', 'SKU'),
      from: tr('מ', 'from'),
      or: tr('או', 'or'),
      mailbox: tr('תיבת דוא"ל', 'mailbox'),
      month: tr('חודש', 'month'),
    },

    // MISSING KEY FALLBACK ====================
    // This is used by the tr() helper to indicate missing keys
    // It should not be directly accessed
  }
}

/**
 * Enhanced tr() helper that supports fallback to [MISSING:key] format
 * Usage: useTranslation(labels) to get the tr function
 *
 * To use labels in components:
 * const labels = getCommonLabels(tr)
 * Then access: labels.navigation.dashboard, labels.actions.create, etc.
 */
export function useTranslation(labels) {
  return labels
}
