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
    path: '/invoices/:id',
    name: 'InvoiceDetail',
    component: () => import('../views/InvoiceDetail.vue'),
    meta: {
      title: 'Invoice Detail',
      requiresAuth: true
    },
  },
  {
    path: '/reports/dashboard',
    name: 'DashboardReport',
    component: () => import('../views/reports/DashboardReport.vue'),
    meta: {
      title: 'Dashboard Report',
      requiresAuth: true
    },
  },
  {
    path: '/reports/villa-occupancy',
    name: 'VillaOccupancyReport',
    component: () => import('../views/reports/VillaOccupancyReport.vue'),
    meta: {
      title: 'Villa Occupancy Report',
      requiresAuth: true
    },
  },
  {
    path: '/reports/booking-status',
    name: 'BookingStatusReport',
    component: () => import('../views/reports/BookingStatusReport.vue'),
    meta: {
      title: 'Booking Status Report',
      requiresAuth: true
    },
  },
  {
    path: '/reports/revenue',
    name: 'RevenueReport',
    component: () => import('../views/reports/RevenueReport.vue'),
    meta: {
      title: 'Revenue Report',
      requiresAuth: true
    },
  },
  {
    path: '/reports/top-villas',
    name: 'TopVillasReport',
    component: () => import('../views/reports/TopVillasReport.vue'),
    meta: {
      title: 'Top Villas Report',
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
