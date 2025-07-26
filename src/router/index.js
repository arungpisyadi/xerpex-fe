import { createRouter, createWebHistory } from 'vue-router'
import erpRoutes from './erp-routes'
import { authService } from '../services'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: erpRoutes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = `XerpeX ERP - ${to.meta.title || 'Dashboard'}`

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to login page
      next({
        path: '/signin',
        query: { redirect: to.fullPath }
      })
    } else {
      // User is authenticated, proceed
      next()
    }
  } else {
    // Route does not require authentication, proceed
    next()
  }
})

export default router
