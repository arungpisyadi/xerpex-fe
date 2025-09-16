import {
  PermissionAction,
  PermissionState,
  SystemModule,
  MatrixRole,
} from '../types/permissions.types';

import type {
  PermissionMatrix,
  SystemRole,
  RoleMapping
} from '../types/permissions.types';

/**
 * Permission Matrix Configuration
 * Based on the provided spreadsheet data
 * Maps each role to their specific permissions for each module and action
 */
export const PERMISSION_MATRIX: PermissionMatrix = {
  [MatrixRole.ADMIN]: {
    [SystemModule.USER]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.VILLAS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.PACKAGES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.BOOKINGS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.SURVEYS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.CUSTOMERS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.QUOTES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.INVOICES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.PAYMENTS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.SETTINGS_GENERAL]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.SETTINGS_TARGETS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
  },

  [MatrixRole.MANAGER]: {
    [SystemModule.USER]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.VILLAS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.PACKAGES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.BOOKINGS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SURVEYS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.CUSTOMERS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.QUOTES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.INVOICES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.PAYMENTS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SETTINGS_GENERAL]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SETTINGS_TARGETS]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
  },

  [MatrixRole.FINANCE]: {
    [SystemModule.USER]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.VILLAS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.PACKAGES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.BOOKINGS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SURVEYS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.CUSTOMERS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.QUOTES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.INVOICES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.PAYMENTS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.ENABLED,
    },
    [SystemModule.SETTINGS_GENERAL]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SETTINGS_TARGETS]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
  },

  [MatrixRole.SALES]: {
    [SystemModule.USER]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.VILLAS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.PACKAGES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.BOOKINGS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SURVEYS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.CUSTOMERS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.QUOTES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.INVOICES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.ENABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.PAYMENTS]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SETTINGS_GENERAL]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.ENABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SETTINGS_TARGETS]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
  },

  [MatrixRole.SURVEY]: {
    [SystemModule.USER]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.VILLAS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.PACKAGES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.BOOKINGS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SURVEYS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.CUSTOMERS]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.QUOTES]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.INVOICES]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.PAYMENTS]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SETTINGS_GENERAL]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SETTINGS_TARGETS]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
  },

  [MatrixRole.STAFF]: {
    [SystemModule.USER]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.VILLAS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.PACKAGES]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.BOOKINGS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SURVEYS]: {
      [PermissionAction.VIEW]: PermissionState.ENABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.CUSTOMERS]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.QUOTES]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.INVOICES]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.PAYMENTS]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SETTINGS_GENERAL]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
    [SystemModule.SETTINGS_TARGETS]: {
      [PermissionAction.VIEW]: PermissionState.DISABLED,
      [PermissionAction.CREATE]: PermissionState.DISABLED,
      [PermissionAction.UPDATE]: PermissionState.DISABLED,
      [PermissionAction.DELETE]: PermissionState.DISABLED,
    },
  },
};

/**
 * Role Mapping Configuration
 * Maps system roles to matrix roles for permission checking
 * Note: 'Sales' role from spreadsheet doesn't exist in current system,
 * so it's not mapped but available for future use
 */
export const ROLE_MAPPING: RoleMapping = {
  'admin': MatrixRole.ADMIN,
  'manager': MatrixRole.MANAGER,
  'finance': MatrixRole.FINANCE,
  'sales': MatrixRole.SALES,
  'survey-admin': MatrixRole.SURVEY,
  'staff': MatrixRole.STAFF,
};

/**
 * Get all available modules
 */
export const getAvailableModules = (): SystemModule[] => {
  return Object.values(SystemModule);
};

/**
 * Get all available actions
 */
export const getAvailableActions = (): PermissionAction[] => {
  return Object.values(PermissionAction);
};

/**
 * Get all matrix roles
 */
export const getMatrixRoles = (): MatrixRole[] => {
  return Object.values(MatrixRole);
};

/**
 * Get all system roles
 */
export const getSystemRoles = (): SystemRole[] => {
  return ['admin', 'finance', 'manager', 'sales', 'survey-admin', 'staff'];
};

/**
 * Check if a role mapping exists for a system role
 */
export const hasRoleMapping = (systemRole: SystemRole): boolean => {
  return systemRole in ROLE_MAPPING;
};

/**
 * Get matrix role from system role
 */
export const getMatrixRole = (systemRole: SystemRole): MatrixRole | null => {
  return ROLE_MAPPING[systemRole] || null;
};

/**
 * Get system role from matrix role
 */
export const getSystemRole = (matrixRole: MatrixRole): SystemRole | null => {
  const entry = Object.entries(ROLE_MAPPING).find(([, value]) => value === matrixRole);
  return entry ? entry[0] as SystemRole : null;
};

/**
 * Default export for easy importing
 */
export default {
  PERMISSION_MATRIX,
  ROLE_MAPPING,
  getAvailableModules,
  getAvailableActions,
  getMatrixRoles,
  getSystemRoles,
  hasRoleMapping,
  getMatrixRole,
  getSystemRole,
};
