// ERP system routes
const erpRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    },
  },
  // Customer Management
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('../views/Customers.vue'),
    meta: {
      title: 'Customer Management',
      requiresAuth: true
    },
  },
  // Tax Management
  {
    path: '/taxes',
    name: 'Taxes',
    component: () => import('../views/Taxes.vue'),
    meta: {
      title: 'Tax Management',
      requiresAuth: true
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: {
      title: 'Users Management',
      requiresAuth: true
    },
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('../views/UserDetail.vue'),
    meta: {
      title: 'User Detail',
      requiresAuth: true
    },
  },
  {
    path: '/villas',
    name: 'Villas',
    component: () => import('../views/Villas.vue'),
    meta: {
      title: 'Villas Management',
      requiresAuth: true
    },
  },
  {
    path: '/villas/:id',
    name: 'VillaDetail',
    component: () => import('../views/VillaDetail.vue'),
    meta: {
      title: 'Villa Detail',
      requiresAuth: true
    },
  },
  // Quote Management
  {
    path: '/quotes',
    name: 'Quotes',
    component: () => import('../views/Quotes.vue'),
    meta: {
      title: 'Quote Management',
      requiresAuth: true
    },
  },
  {
    path: '/quotes/create',
    name: 'CreateQuote',
    component: () => import('../views/Quotes/CreateQuote.vue'),
    meta: {
      title: 'Create Quote',
      requiresAuth: true
    },
  },
  {
    path: '/quotes/edit/:id',
    name: 'EditQuote',
    component: () => import('../views/Quotes/EditQuote.vue'),
    meta: {
      title: 'Edit Quote',
      requiresAuth: true
    },
  },
  {
    path: '/packages',
    name: 'Packages',
    component: () => import('../views/Packages.vue'),
    meta: {
      title: 'Packages Management',
      requiresAuth: true
    },
  },
  {
    path: '/surveys',
    name: 'Surveys',
    component: () => import('../views/Surveys.vue'),
    meta: {
      title: 'Surveys Management',
      requiresAuth: true
    },
  },
  {
    path: '/salesmen',
    name: 'Salesmen',
    component: () => import('../views/Salesmen.vue'),
    meta: {
      title: 'Salesmen Management',
      requiresAuth: true
    },
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: () => import('../views/Bookings.vue'),
    meta: {
      title: 'Bookings Management',
      requiresAuth: true
    },
  },
  {
    path: '/bookings/:id',
    name: 'BookingDetail',
    component: () => import('../views/BookingDetail.vue'),
    meta: {
      title: 'Booking Detail',
      requiresAuth: true
    },
  },
  {
    path: '/payments',
    name: 'Payments',
    component: () => import('../views/Payments.vue'),
    meta: {
      title: 'Payments Management',
      requiresAuth: true
    },
  },
  {
    path: '/payments/:id',
    name: 'PaymentDetail',
    component: () => import('../views/PaymentDetail.vue'),
    meta: {
      title: 'Payment Detail',
      requiresAuth: true
    },
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () => import('../views/Invoices.vue'),
    meta: {
      title: 'Invoices Management',
      requiresAuth: true
    },
  },
  {
    path: '/invoices/create',
    name: 'CreateInvoice',
    component: () => import('../views/Invoices/CreateInvoice.vue'),
    meta: {
      title: 'Create Invoice',
      requiresAuth: true
    },
  },
  {
    path: '/invoices/edit/:id',
    name: 'EditInvoice',
    component: () => import('../views/Invoices/EditInvoice.vue'),
    meta: {
      title: 'Edit Invoice',
      requiresAuth: true
    },
  },
  {
    path: '/invoices/:id',
    name: 'InvoiceDetail',
    component: () => import('../views/InvoiceDetail.vue'),
    meta: {
      title: 'Invoice Detail',
      requiresAuth: true
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: 'Settings',
      requiresAuth: true
    },
  },
  // Authentication routes
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('../views/Auth/Signin.vue'),
    meta: {
      title: 'Sign In',
      requiresAuth: false
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Auth/Signup.vue'),
    meta: {
      title: 'Sign Up',
      requiresAuth: false
    },
  },
  // Error routes
  {
    path: '/404',
    name: 'NotFoundPage',
    component: () => import('../views/Errors/FourZeroFour.vue'),
    meta: {
      title: '404 Not Found',
      requiresAuth: false
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/Errors/FourZeroFour.vue'),
    meta: {
      title: '404 Not Found',
      requiresAuth: false
    },
  }
];

export default erpRoutes;
