// ERP system routes
import { SystemModule, PermissionAction } from '../types/permissions.types'

const erpRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
    },
  },
  // Customer Management
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('../views/Customers.vue'),
    meta: {
      title: 'Customer Management',
      requiresAuth: true,
      module: SystemModule.CUSTOMERS,
      action: PermissionAction.VIEW,
    },
  },
  // Tax Management
  {
    path: '/taxes',
    name: 'Taxes',
    component: () => import('../views/Taxes.vue'),
    meta: {
      title: 'Tax Management',
      requiresAuth: true,
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: {
      title: 'Users Management',
      requiresAuth: true,
      module: SystemModule.USER,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('../views/UserDetail.vue'),
    meta: {
      title: 'User Detail',
      requiresAuth: true,
      module: SystemModule.USER,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/villas',
    name: 'Villas',
    component: () => import('../views/Villas.vue'),
    meta: {
      title: 'Villas Management',
      requiresAuth: true,
      module: SystemModule.VILLAS,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/villas/:id',
    name: 'VillaDetail',
    component: () => import('../views/VillaDetail.vue'),
    meta: {
      title: 'Villa Detail',
      requiresAuth: true,
      module: SystemModule.VILLAS,
      action: PermissionAction.VIEW,
    },
  },
  // Quote Management
  {
    path: '/quotes',
    name: 'Quotes',
    component: () => import('../views/Quotes.vue'),
    meta: {
      title: 'Quote Management',
      requiresAuth: true,
      module: SystemModule.QUOTES,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/quotes/create',
    name: 'CreateQuote',
    component: () => import('../views/Quotes/CreateQuote.vue'),
    meta: {
      title: 'Create Quote',
      requiresAuth: true,
      module: SystemModule.QUOTES,
      action: PermissionAction.CREATE,
    },
  },
  {
    path: '/quotes/edit/:id',
    name: 'EditQuote',
    component: () => import('../views/Quotes/EditQuote.vue'),
    meta: {
      title: 'Edit Quote',
      requiresAuth: true,
      module: SystemModule.QUOTES,
      action: PermissionAction.UPDATE,
    },
  },
  {
    path: '/quotes/:id',
    name: 'QuoteDetail',
    component: () => import('../views/Quotes/QuoteDetail.vue'),
    meta: {
      title: 'Quote Detail',
      requiresAuth: true,
      module: SystemModule.QUOTES,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/quotes/:id/preview',
    name: 'QuotePreview',
    component: () => import('../views/Quotes/QuotePreview.vue'),
    meta: {
      title: 'Quote Preview',
      requiresAuth: true,
      fullScreen: true,
      module: SystemModule.QUOTES,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/quotes/:id/pdf/view',
    name: 'QuotePdfView',
    component: () => import('../views/Quotes/QuotePdfView.vue'),
    meta: {
      title: 'Quote PDF View',
      requiresAuth: true,
      fullScreen: true,
      module: SystemModule.QUOTES,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/packages',
    name: 'Packages',
    component: () => import('../views/Packages.vue'),
    meta: {
      title: 'Packages Management',
      requiresAuth: true,
      module: SystemModule.PACKAGES,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/surveys',
    name: 'Surveys',
    component: () => import('../views/Surveys.vue'),
    meta: {
      title: 'Surveys Management',
      requiresAuth: true,
      module: SystemModule.SURVEYS,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: () => import('../views/Bookings.vue'),
    meta: {
      title: 'Bookings Management',
      requiresAuth: true,
      module: SystemModule.BOOKINGS,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/bookings/create',
    name: 'CreateBooking',
    component: () => import('../views/CreateBooking.vue'),
    meta: {
      title: 'Create Booking',
      requiresAuth: true,
      module: SystemModule.BOOKINGS,
      action: PermissionAction.CREATE,
    },
  },
  {
    path: '/bookings/edit/:id',
    name: 'EditBooking',
    component: () => import('../views/EditBooking.vue'),
    meta: {
      title: 'Edit Booking',
      requiresAuth: true,
      module: SystemModule.BOOKINGS,
      action: PermissionAction.UPDATE,
    },
  },
  {
    path: '/bookings/:id',
    name: 'BookingDetail',
    component: () => import('../views/BookingDetail.vue'),
    meta: {
      title: 'Booking Detail',
      requiresAuth: true,
      module: SystemModule.BOOKINGS,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/payments',
    name: 'Payments',
    component: () => import('../views/Payments.vue'),
    meta: {
      title: 'Payments Management',
      requiresAuth: true,
      module: SystemModule.PAYMENTS,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/payments/:id',
    name: 'PaymentDetail',
    component: () => import('../views/PaymentDetail.vue'),
    meta: {
      title: 'Payment Detail',
      requiresAuth: true,
      module: SystemModule.PAYMENTS,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () => import('../views/Invoices.vue'),
    meta: {
      title: 'Invoices Management',
      requiresAuth: true,
      module: SystemModule.INVOICES,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/invoices/create',
    name: 'CreateInvoice',
    component: () => import('../views/Invoices/CreateInvoice.vue'),
    meta: {
      title: 'Create Invoice',
      requiresAuth: true,
      module: SystemModule.INVOICES,
      action: PermissionAction.CREATE,
    },
  },
  {
    path: '/invoices/edit/:invoiceId',
    name: 'EditInvoice',
    component: () => import('../views/Invoices/EditInvoice.vue'),
    meta: {
      title: 'Edit Invoice',
      requiresAuth: true,
      module: SystemModule.INVOICES,
      action: PermissionAction.UPDATE,
    },
  },
  {
    path: '/invoices/:invoiceId',
    name: 'InvoiceDetail',
    component: () => import('../views/InvoiceDetail.vue'),
    meta: {
      title: 'Invoice Detail',
      requiresAuth: true,
      module: SystemModule.INVOICES,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/invoices/:invoiceId/preview',
    name: 'InvoicePreview',
    component: () => import('../views/Invoices/InvoicePreview.vue'),
    meta: {
      title: 'Invoice Preview',
      requiresAuth: true,
      fullScreen: true,
      module: SystemModule.INVOICES,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/invoices/:id/pdf/view',
    name: 'InvoicePdfView',
    component: () => import('../views/Invoices/InvoicePdfView.vue'),
    meta: {
      title: 'Invoice PDF View',
      requiresAuth: true,
      fullScreen: true,
      module: SystemModule.INVOICES,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: 'Settings',
      requiresAuth: true,
      module: SystemModule.SETTINGS_GENERAL,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/targets',
    name: 'Targets',
    component: () => import('../views/Targets.vue'),
    meta: {
      title: 'Targets Management',
      requiresAuth: true,
      requiresAdmin: true,
      module: SystemModule.SETTINGS_TARGETS,
      action: PermissionAction.VIEW,
    },
  },
  // Profile route
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Others/UserProfile.vue'),
    meta: {
      title: 'Profile',
      requiresAuth: true,
    },
  },
  // Report routes
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports/SalesReport.vue'),
    meta: {
      title: 'Reports',
      requiresAuth: true,
      module: SystemModule.REPORTS,
      action: PermissionAction.VIEW,
    },
  },
  {
    path: '/reports/sales',
    name: 'SalesReport',
    component: () => import('../views/Reports/SalesReport.vue'),
    meta: {
      title: 'Sales Report',
      requiresAuth: true,
      module: SystemModule.REPORTS_SALES,
      action: PermissionAction.VIEW,
    },
  },
  // Authentication routes
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('../views/Auth/Signin.vue'),
    meta: {
      title: 'Sign In',
      requiresAuth: false,
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Auth/Signup.vue'),
    meta: {
      title: 'Sign Up',
      requiresAuth: false,
    },
  },
  // Error routes
  {
    path: '/404',
    name: 'NotFoundPage',
    component: () => import('../views/Errors/FourZeroFour.vue'),
    meta: {
      title: '404 Not Found',
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/Errors/FourZeroFour.vue'),
    meta: {
      title: '404 Not Found',
      requiresAuth: false,
    },
  },
]

export default erpRoutes
