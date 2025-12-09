import { ref, computed, reactive } from 'vue'
import authService from '../services/auth.service.ts'
import { PERMISSION_MATRIX, ROLE_MAPPING, getMatrixRole } from '../config/permissions.config'

import type {
  SystemModule,
  PermissionAction,
  SystemRole,
  PermissionCheckResult,
  RolePermissions,
  PermissionContext,
  PermissionSummary,
  IPermissionService,
} from '../types/permissions.types'

import { MatrixRole } from '../types/permissions.types'

import { PermissionState } from '../types/permissions.types'

/**
 * Permission Management Composable
 * Provides comprehensive permission checking functionality
 * Integrates with existing auth service
 */
export function usePermissions() {
  // Reactive permission context
  const permissionContext = reactive<PermissionContext>({
    userRole: null,
    matrixRole: null,
    isAuthenticated: false,
  })

  /**
   * Update permission context based on current auth state
   */
  const refreshPermissions = (): void => {
    const currentUser = authService.getCurrentUser()
    const isAuth = authService.isAuthenticated()

    permissionContext.isAuthenticated = isAuth
    permissionContext.userRole = currentUser?.role || null
    permissionContext.matrixRole = currentUser?.role
      ? mapSystemRoleToMatrixRole(currentUser.role)
      : null
  }

  /**
   * Map system role to matrix role
   */
  const mapSystemRoleToMatrixRole = (systemRole: SystemRole): MatrixRole | null => {
    return getMatrixRole(systemRole)
  }

  /**
   * Get current user's matrix role
   */
  const getCurrentUserMatrixRole = (): MatrixRole | null => {
    return permissionContext.matrixRole
  }

  /**
   * Check if current user can perform action on module
   */
  const canPerform = (module: SystemModule, action: PermissionAction): boolean => {
    const matrixRole = getCurrentUserMatrixRole()

    if (!matrixRole || !permissionContext.isAuthenticated) {
      return false
    }

    return canRolePerform(matrixRole, module, action)
  }

  /**
   * Check if specific role can perform action on module
   */
  const canRolePerform = (
    role: MatrixRole,
    module: SystemModule,
    action: PermissionAction,
  ): boolean => {
    try {
      const rolePermissions = PERMISSION_MATRIX[role]

      if (!rolePermissions) {
        return false
      }

      const modulePermissions = rolePermissions[module]

      if (!modulePermissions) {
        return false
      }

      const actionPermission = modulePermissions[action]

      return actionPermission === PermissionState.ENABLED
    } catch (error) {
      console.error('Error checking role permission:', error)
      return false
    }
  }

  /**
   * Get all permissions for current user
   */
  const getUserPermissions = (): RolePermissions | null => {
    const matrixRole = getCurrentUserMatrixRole()
    if (!matrixRole) {
      return null
    }

    return getRolePermissions(matrixRole)
  }

  /**
   * Get all permissions for specific role
   */
  const getRolePermissions = (role: MatrixRole): RolePermissions => {
    return PERMISSION_MATRIX[role]
  }

  /**
   * Get detailed permission check result
   */
  const checkPermission = (
    module: SystemModule,
    action: PermissionAction,
  ): PermissionCheckResult => {
    const matrixRole = getCurrentUserMatrixRole()

    if (!permissionContext.isAuthenticated) {
      return {
        allowed: false,
        role: null,
        module,
        action,
        reason: 'User is not authenticated',
      }
    }

    if (!matrixRole) {
      return {
        allowed: false,
        role: null,
        module,
        action,
        reason: 'User role is not mapped to permission matrix',
      }
    }

    const allowed = canRolePerform(matrixRole, module, action)

    return {
      allowed,
      role: matrixRole,
      module,
      action,
      reason: allowed
        ? 'Permission granted'
        : `Role ${matrixRole} does not have ${action} permission for ${module}`,
    }
  }

  /**
   * Get permission summary for a role
   */
  const getPermissionSummary = (role?: MatrixRole): PermissionSummary | null => {
    const targetRole = role || getCurrentUserMatrixRole()
    if (!targetRole) {
      return null
    }

    const rolePermissions = getRolePermissions(targetRole)
    let totalPermissions = 0
    let enabledPermissions = 0
    let disabledPermissions = 0

    const moduleBreakdown: PermissionSummary['moduleBreakdown'] = {} as any

    // Calculate permissions for each module
    Object.entries(rolePermissions).forEach(([module, permissions]) => {
      const moduleKey = module as SystemModule
      let moduleEnabled = 0
      let moduleDisabled = 0

      Object.values(permissions).forEach((permission) => {
        totalPermissions++
        if (permission === PermissionState.ENABLED) {
          enabledPermissions++
          moduleEnabled++
        } else {
          disabledPermissions++
          moduleDisabled++
        }
      })

      moduleBreakdown[moduleKey] = {
        enabled: moduleEnabled,
        disabled: moduleDisabled,
        total: moduleEnabled + moduleDisabled,
      }
    })

    return {
      role: targetRole,
      totalPermissions,
      enabledPermissions,
      disabledPermissions,
      moduleBreakdown,
    }
  }

  /**
   * Check multiple permissions at once
   */
  const checkMultiplePermissions = (
    checks: Array<{ module: SystemModule; action: PermissionAction }>,
  ): PermissionCheckResult[] => {
    return checks.map((check) => checkPermission(check.module, check.action))
  }

  /**
   * Check if user can access module (has any permission)
   */
  const canAccessModule = (module: SystemModule): boolean => {
    const matrixRole = getCurrentUserMatrixRole()
    if (!matrixRole || !permissionContext.isAuthenticated) {
      return false
    }

    const modulePermissions = PERMISSION_MATRIX[matrixRole][module]
    return Object.values(modulePermissions).some(
      (permission) => permission === PermissionState.ENABLED,
    )
  }

  /**
   * Get all modules user can access
   */
  const getAccessibleModules = (): SystemModule[] => {
    const matrixRole = getCurrentUserMatrixRole()
    if (!matrixRole || !permissionContext.isAuthenticated) {
      return []
    }

    const rolePermissions = PERMISSION_MATRIX[matrixRole]
    const accessibleModules: SystemModule[] = []

    Object.entries(rolePermissions).forEach(([module, permissions]) => {
      const hasAnyPermission = Object.values(permissions).some(
        (permission) => permission === PermissionState.ENABLED,
      )
      if (hasAnyPermission) {
        accessibleModules.push(module as SystemModule)
      }
    })

    return accessibleModules
  }

  /**
   * Get all actions user can perform on a module
   */
  const getModuleActions = (module: SystemModule): PermissionAction[] => {
    const matrixRole = getCurrentUserMatrixRole()
    if (!matrixRole || !permissionContext.isAuthenticated) {
      return []
    }

    const modulePermissions = PERMISSION_MATRIX[matrixRole][module]
    const allowedActions: PermissionAction[] = []

    Object.entries(modulePermissions).forEach(([action, permission]) => {
      if (permission === PermissionState.ENABLED) {
        allowedActions.push(action as PermissionAction)
      }
    })

    return allowedActions
  }

  /**
   * Check if user is admin (has all permissions)
   */
  const isAdmin = (): boolean => {
    return getCurrentUserMatrixRole() === MatrixRole.ADMIN
  }

  /**
   * Check if user has elevated permissions (admin or manager)
   */
  const hasElevatedPermissions = (): boolean => {
    const role = getCurrentUserMatrixRole()
    return role === MatrixRole.ADMIN || role === MatrixRole.MANAGER
  }

  /**
   * Force refresh of permissions context
   * Should be called after authentication state changes
   */
  const forceRefreshPermissions = (): void => {
    refreshPermissions()
  }

  // Initialize permissions on composable creation
  refreshPermissions()

  // Return the service interface
  return {
    // Core permission methods
    canPerform,
    canRolePerform,
    getUserPermissions,
    getRolePermissions,
    getCurrentUserMatrixRole,
    mapSystemRoleToMatrixRole,
    checkPermission,

    // Additional utility methods
    permissionContext,
    refreshPermissions,
    forceRefreshPermissions,
    getPermissionSummary,
    checkMultiplePermissions,
    canAccessModule,
    getAccessibleModules,
    getModuleActions,
    isAdmin,
    hasElevatedPermissions,
  }
}

/**
 * Global permission service instance
 * Can be used outside of Vue components
 */
class PermissionService implements IPermissionService {
  canPerform(module: SystemModule, action: PermissionAction): boolean {
    const currentUser = authService.getCurrentUser()
    if (!currentUser || !authService.isAuthenticated()) {
      return false
    }

    const matrixRole = getMatrixRole(currentUser.role)
    if (!matrixRole) {
      return false
    }

    return this.canRolePerform(matrixRole, module, action)
  }

  canRolePerform(role: MatrixRole, module: SystemModule, action: PermissionAction): boolean {
    try {
      const rolePermissions = PERMISSION_MATRIX[role]
      const modulePermissions = rolePermissions?.[module]
      const actionPermission = modulePermissions?.[action]
      return actionPermission === PermissionState.ENABLED
    } catch {
      return false
    }
  }

  getUserPermissions(): RolePermissions | null {
    const matrixRole = this.getCurrentUserMatrixRole()
    return matrixRole ? this.getRolePermissions(matrixRole) : null
  }

  getRolePermissions(role: MatrixRole): RolePermissions {
    return PERMISSION_MATRIX[role]
  }

  getCurrentUserMatrixRole(): MatrixRole | null {
    const currentUser = authService.getCurrentUser()
    return currentUser ? getMatrixRole(currentUser.role) : null
  }

  mapSystemRoleToMatrixRole(systemRole: SystemRole): MatrixRole | null {
    return getMatrixRole(systemRole)
  }

  checkPermission(module: SystemModule, action: PermissionAction): PermissionCheckResult {
    const matrixRole = this.getCurrentUserMatrixRole()
    const isAuthenticated = authService.isAuthenticated()

    if (!isAuthenticated) {
      return {
        allowed: false,
        role: null,
        module,
        action,
        reason: 'User is not authenticated',
      }
    }

    if (!matrixRole) {
      return {
        allowed: false,
        role: null,
        module,
        action,
        reason: 'User role is not mapped to permission matrix',
      }
    }

    const allowed = this.canRolePerform(matrixRole, module, action)

    return {
      allowed,
      role: matrixRole,
      module,
      action,
      reason: allowed
        ? 'Permission granted'
        : `Role ${matrixRole} does not have ${action} permission for ${module}`,
    }
  }
}

/**
 * Global permission service instance for use outside Vue components
 */
export const permissionService = new PermissionService()

/**
 * Default export for easy importing
 */
export default usePermissions
