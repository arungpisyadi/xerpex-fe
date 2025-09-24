/**
 * Permission Actions
 * Actions that can be performed on modules
 */
export enum PermissionAction {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

/**
 * System Modules
 * All modules available in the system
 */
export enum SystemModule {
  USER = 'User',
  VILLAS = 'Villas',
  PACKAGES = 'Packages',
  BOOKINGS = 'Bookings',
  SURVEYS = 'Surveys',
  CUSTOMERS = 'Customers',
  QUOTES = 'Quotes',
  INVOICES = 'Invoices',
  PAYMENTS = 'Payments',
  SETTINGS_GENERAL = 'Settings - General',
  SETTINGS_TARGETS = 'Settings - Targets'
}

/**
 * Permission Matrix Roles
 * Roles as defined in the permission matrix spreadsheet
 */
export enum MatrixRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  FINANCE = 'Finance',
  SALES = 'Sales',
  SURVEY = 'Survey',
  STAFF = 'Staff'
}

/**
 * System Roles
 * Current roles used in the auth system
 */
export type SystemRole = 'admin' | 'finance' | 'manager' | 'survey-admin' | 'survey' | 'staff' | 'sales';

/**
 * Permission State
 * Whether a permission is enabled or disabled
 */
export enum PermissionState {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

/**
 * Module Permissions
 * All permissions for a specific module
 */
export interface ModulePermissions {
  [PermissionAction.VIEW]: PermissionState;
  [PermissionAction.CREATE]: PermissionState;
  [PermissionAction.UPDATE]: PermissionState;
  [PermissionAction.DELETE]: PermissionState;
}

/**
 * Role Permissions
 * All module permissions for a specific role
 */
export interface RolePermissions {
  [SystemModule.USER]: ModulePermissions;
  [SystemModule.VILLAS]: ModulePermissions;
  [SystemModule.PACKAGES]: ModulePermissions;
  [SystemModule.BOOKINGS]: ModulePermissions;
  [SystemModule.SURVEYS]: ModulePermissions;
  [SystemModule.CUSTOMERS]: ModulePermissions;
  [SystemModule.QUOTES]: ModulePermissions;
  [SystemModule.INVOICES]: ModulePermissions;
  [SystemModule.PAYMENTS]: ModulePermissions;
  [SystemModule.SETTINGS_GENERAL]: ModulePermissions;
  [SystemModule.SETTINGS_TARGETS]: ModulePermissions;
}

/**
 * Permission Matrix
 * Complete permission matrix for all roles
 */
export interface PermissionMatrix {
  [MatrixRole.ADMIN]: RolePermissions;
  [MatrixRole.MANAGER]: RolePermissions;
  [MatrixRole.FINANCE]: RolePermissions;
  [MatrixRole.SALES]: RolePermissions;
  [MatrixRole.SURVEY]: RolePermissions;
  [MatrixRole.STAFF]: RolePermissions;
}

/**
 * Role Mapping
 * Maps system roles to matrix roles
 */
export interface RoleMapping {
  [key: string]: MatrixRole;
}

/**
 * Permission Check Result
 * Result of a permission check operation
 */
export interface PermissionCheckResult {
  allowed: boolean;
  role: MatrixRole | null;
  module: SystemModule;
  action: PermissionAction;
  reason?: string;
}

/**
 * Permission Service Interface
 * Interface for permission checking service
 */
export interface IPermissionService {
  /**
   * Check if current user can perform action on module
   */
  canPerform(module: SystemModule, action: PermissionAction): boolean;

  /**
   * Check if specific role can perform action on module
   */
  canRolePerform(role: MatrixRole, module: SystemModule, action: PermissionAction): boolean;

  /**
   * Get all permissions for current user
   */
  getUserPermissions(): RolePermissions | null;

  /**
   * Get all permissions for specific role
   */
  getRolePermissions(role: MatrixRole): RolePermissions;

  /**
   * Get current user's matrix role
   */
  getCurrentUserMatrixRole(): MatrixRole | null;

  /**
   * Map system role to matrix role
   */
  mapSystemRoleToMatrixRole(systemRole: SystemRole): MatrixRole | null;

  /**
   * Get detailed permission check result
   */
  checkPermission(module: SystemModule, action: PermissionAction): PermissionCheckResult;
}

/**
 * Permission Context
 * Context for permission checking
 */
export interface PermissionContext {
  userRole: SystemRole | null;
  matrixRole: MatrixRole | null;
  isAuthenticated: boolean;
}

/**
 * Module Action Map
 * Maps modules to their available actions
 */
export type ModuleActionMap = {
  [key in SystemModule]: PermissionAction[];
};

/**
 * Permission Summary
 * Summary of permissions for a role
 */
export interface PermissionSummary {
  role: MatrixRole;
  totalPermissions: number;
  enabledPermissions: number;
  disabledPermissions: number;
  moduleBreakdown: {
    [key in SystemModule]: {
      enabled: number;
      disabled: number;
      total: number;
    };
  };
}
