import { createRouter, createWebHistory } from 'vue-router'
import erpRoutes from './erp-routes'
import authService from '../services/auth.service.ts'
import { permissionService } from '../composables/usePermissions'
import { SystemModule, PermissionAction } from '../types/permissions.types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: erpRoutes
})

// Navigation guard for authentication and permissions
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
      return
    }

    // Check permissions if route has module/action metadata
    const routeWithPermission = to.matched.find(record =>
      record.meta.module && record.meta.action
    )

    if (routeWithPermission) {
      const { module, action } = routeWithPermission.meta

      // Check if user has permission for this module and action
      const hasPermission = permissionService.canPerform(module, action)

      if (!hasPermission) {
        console.warn(`Access denied: User lacks ${action} permission for ${module}`)

        // Redirect to dashboard if user doesn't have permission
        // Don't create infinite redirect loops
        if (to.path !== '/') {
          next({
            path: '/',
            query: {
              error: 'insufficient_permissions',
              attempted: to.path
            }
          })
        } else {
          // If trying to access dashboard but no permission, show error
          next({ path: '/404' })
        }
        return
      }
    }

    // Backward compatibility: Check if route requires admin access (legacy)
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!authService.isAdmin()) {
        // User is not admin, redirect to dashboard
        next({
          path: '/',
          query: {
            error: 'admin_required',
            attempted: to.path
          }
        })
        return
      }
    }

    // User is authenticated and has required permissions, proceed
    next()
  } else {
    // Route does not require authentication, proceed
    next()
  }
})

export default router
