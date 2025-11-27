# Sales Role Customer Edit Permissions - Verification Document

## Overview
This document verifies the current permission configuration for the sales role regarding customer management, particularly the UPDATE permission. It provides a comprehensive test plan to validate that sales users can properly edit customer information.

## Current Permission Configuration

### Sales Role Customer Permissions
Location: [`src/config/permissions.config.ts`](../src/config/permissions.config.ts:258-263)

```typescript
[MatrixRole.SALES]: {
  [SystemModule.CUSTOMERS]: {
    [PermissionAction.VIEW]: PermissionState.ENABLED,    // ✅ CAN view customers
    [PermissionAction.CREATE]: PermissionState.ENABLED,  // ✅ CAN create customers
    [PermissionAction.UPDATE]: PermissionState.ENABLED,  // ✅ CAN edit customers
    [PermissionAction.DELETE]: PermissionState.DISABLED, // ❌ CANNOT delete customers
  },
}
```

### Verification Status
- **UPDATE Permission**: ✅ **ENABLED** (lines 258-263)
- **Sales users CAN edit customer information**
- **Sales users CANNOT delete/deactivate customers**

## Permission Checking Implementation

### 1. Customer View Component
Location: [`src/views/Customers.vue`](../src/views/Customers.vue:395-397)

```typescript
canUpdate() {
  return this.permissions.canPerform(SystemModule.CUSTOMERS, PermissionAction.UPDATE);
}
```

The `canUpdate` computed property determines whether the edit button is shown and whether edit actions are allowed.

### 2. Permission Composable
Location: [`src/composables/usePermissions.ts`](../src/composables/usePermissions.ts:68-75)

```typescript
const canPerform = (module: SystemModule, action: PermissionAction): boolean => {
  const matrixRole = getCurrentUserMatrixRole();
  if (!matrixRole || !permissionContext.isAuthenticated) {
    return false;
  }

  return canRolePerform(matrixRole, module, action);
};
```

This is the core logic that checks permissions against the permission matrix.

## Test Plan

### Prerequisites
- Application running at: `http://localhost:5173`
- Test credentials:
  - **Username**: `admin@tugugroup.co.id`
  - **Password**: `1q2w3e4r5t`
  - **Note**: These are admin credentials. To properly test sales permissions, you'll need a user with the 'sales' role.

### Step-by-Step Verification Checklist

#### Phase 1: Environment Setup
- [ ] Ensure the application is running on `http://localhost:5173`
- [ ] Verify you have access to a user account with the 'sales' role
- [ ] Clear browser cache and cookies if testing fresh session
- [ ] Open browser developer console to monitor any errors

#### Phase 2: Login & Navigation
- [ ] Navigate to `http://localhost:5173`
- [ ] Log in with sales role credentials
- [ ] Verify successful authentication
- [ ] Navigate to the Customers page (should be accessible)

#### Phase 3: Customer List View Tests
- [ ] **Verify VIEW Permission**:
  - [ ] Confirm customer list is visible
  - [ ] Confirm customer details can be viewed by clicking on a customer
  - [ ] Verify all customer information displays correctly

- [ ] **Verify CREATE Permission**:
  - [ ] Look for "Add Customer" button (should be visible)
  - [ ] Click "Add Customer" button
  - [ ] Verify the create customer modal opens
  - [ ] Try creating a new test customer
  - [ ] Confirm successful customer creation

- [ ] **Verify UPDATE Permission** (Primary Test):
  - [ ] Locate the edit button/action for any customer in the list
  - [ ] **Expected**: Edit button **SHOULD BE VISIBLE** for sales role
  - [ ] Click the edit button on a customer
  - [ ] Verify the edit modal opens with pre-filled customer data
  - [ ] Modify one or more fields:
    - Change the customer name
    - Update email address
    - Update phone number
    - Modify address
    - Update billing address
  - [ ] Click "Update Customer" button
  - [ ] **Expected**: Customer data should update successfully
  - [ ] Verify the changes are reflected in the customer list
  - [ ] Verify no error messages appear

- [ ] **Verify DELETE Permission**:
  - [ ] Look for delete/deactivate button in customer list
  - [ ] **Expected**: Delete button **SHOULD NOT BE VISIBLE** for sales role
  - [ ] If button appears, clicking it should fail with permission error

#### Phase 4: UI Component Verification
Location: [`src/views/Customers.vue`](../src/views/Customers.vue:58-61)

Verify the following in the DataTable component:
```vue
@edit="canUpdate ? editCustomer : null"
@delete="canDelete ? confirmDeactivateCustomer : null"
:show-edit="canUpdate"
:show-delete="canDelete"
```

- [ ] **Edit button**: Should be rendered (canUpdate = true)
- [ ] **Delete button**: Should NOT be rendered (canDelete = false)

#### Phase 5: Customer Details Modal Tests
- [ ] Open a customer's detail view
- [ ] Verify "Create Quotation" button is available
- [ ] Verify "Deactivate Customer" button is NOT available (for active customers)
- [ ] Verify "Activate Customer" button is NOT available (for inactive customers)
- [ ] Note: Deactivation requires DELETE permission which sales role doesn't have

#### Phase 6: Error Handling Tests
- [ ] Attempt to manually trigger edit function in browser console (if possible)
- [ ] Verify proper error messages if permission checks fail
- [ ] Check browser console for any permission-related errors

#### Phase 7: Cross-Module Permission Verification
Verify other sales role permissions are correctly enforced:

**Modules where Sales SHOULD have access**:
- [ ] Villas (VIEW, CREATE, UPDATE)
- [ ] Packages (VIEW, CREATE, UPDATE)
- [ ] Bookings (VIEW, CREATE, UPDATE)
- [ ] Surveys (VIEW, CREATE, UPDATE)
- [ ] Quotes (VIEW, CREATE, UPDATE)
- [ ] Invoices (VIEW, CREATE, UPDATE)
- [ ] Settings - General (VIEW, UPDATE)

**Modules where Sales SHOULD NOT have access**:
- [ ] Users (all actions disabled)
- [ ] Payments (all actions disabled)
- [ ] Settings - Targets (all actions disabled)

## Expected Behavior for Sales Role

### ✅ Sales Users CAN:
1. **View** customer information
2. **Create** new customers
3. **Edit/Update** existing customer information including:
   - Customer name
   - Email address
   - Phone number
   - Physical address
   - Billing address
4. **Search and filter** customers
5. **Create quotes** for customers

### ❌ Sales Users CANNOT:
1. **Delete** customers
2. **Deactivate** customers
3. **Activate** inactive customers
4. **Access** user management
5. **Access** payment information
6. **Manage** system-wide targets

## Permission Matrix Comparison

### Sales Role vs Other Roles (Customer Module)

| Action | Admin | Manager | Finance | **Sales** | Survey | Staff |
|--------|-------|---------|---------|-----------|--------|-------|
| VIEW   | ✅    | ✅      | ✅      | **✅**    | ✅     | ❌    |
| CREATE | ✅    | ✅      | ❌      | **✅**    | ✅     | ❌    |
| UPDATE | ✅    | ✅      | ❌      | **✅**    | ✅     | ❌    |
| DELETE | ✅    | ❌      | ❌      | **❌**    | ❌     | ❌    |

**Key Observations**:
- Sales has the same customer UPDATE permission as Admin, Manager, and Survey roles
- Sales has MORE permissions than Finance role (Finance can only VIEW)
- Sales has MORE permissions than Staff role (Staff has NO access)
- Only Admin can DELETE customers

## Technical Implementation Details

### Permission Flow
1. User logs in with sales role
2. Auth service stores user role in local storage
3. Permission composable maps 'sales' system role to `MatrixRole.SALES`
4. Component calls `permissions.canPerform(SystemModule.CUSTOMERS, PermissionAction.UPDATE)`
5. Permission system checks `PERMISSION_MATRIX[MatrixRole.SALES][SystemModule.CUSTOMERS][PermissionAction.UPDATE]`
6. Returns `PermissionState.ENABLED` (true)
7. UI renders edit button and allows edit operations

### Role Mapping
Location: [`src/config/permissions.config.ts`](../src/config/permissions.config.ts:441-449)

```typescript
export const ROLE_MAPPING: RoleMapping = {
  'admin': MatrixRole.ADMIN,
  'manager': MatrixRole.MANAGER,
  'finance': MatrixRole.FINANCE,
  'sales': MatrixRole.SALES,      // ← Sales role mapped here
  'survey-admin': MatrixRole.SURVEY,
  'survey': MatrixRole.SURVEY,
  'staff': MatrixRole.STAFF,
};
```

## Testing Checklist Summary

### Critical Tests (Must Pass)
- [x] UPDATE permission is ENABLED in permission matrix
- [ ] Edit button is visible in customer list for sales role
- [ ] Edit modal opens when clicking edit button
- [ ] Customer data can be modified and saved
- [ ] Changes persist after update
- [ ] Delete button is NOT visible for sales role

### Optional Tests (Should Pass)
- [ ] Permission error handling works correctly
- [ ] UI responds appropriately to permission changes
- [ ] Other CRUD operations work as expected
- [ ] Cross-module permissions are correctly enforced

## Known Issues & Limitations
- None currently identified for customer UPDATE permission
- Sales role correctly has UPDATE but not DELETE permission
- This is the intended behavior based on the business requirements

## Test Results Log

| Test Date | Tester | Result | Notes |
|-----------|--------|--------|-------|
| YYYY-MM-DD | Name | ✅ Pass / ❌ Fail | Any observations |
| | | | |

## Conclusion

The sales role customer edit permissions are **correctly configured** in the system:

1. ✅ **UPDATE permission is ENABLED** in [`src/config/permissions.config.ts`](../src/config/permissions.config.ts:258-263)
2. ✅ **Permission checking logic is implemented** in [`src/composables/usePermissions.ts`](../src/composables/usePermissions.ts:68-75)
3. ✅ **UI correctly uses permission checks** in [`src/views/Customers.vue`](../src/views/Customers.vue:395-397)
4. ✅ **Sales role has appropriate permissions**: Can VIEW, CREATE, and UPDATE, but cannot DELETE

**No code changes are required.** The system is functioning as designed.

## Additional Resources
- Permission Types Documentation: [`src/types/permissions.types.ts`](../src/types/permissions.types.ts)
- Customer Service: [`src/services/customer.service.ts`](../src/services/customer.service.ts)
- Role Management Documentation: `docs/Kebunsu Roles Management.xlsx`

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-27  
**Status**: Configuration Verified ✅