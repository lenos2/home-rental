export type Resource =
  | 'properties'
  | 'leases'
  | 'tenants'
  | 'maintenance'
  | 'payments'
  | 'users'
  | 'roles'
  | 'settings'
  | 'billing'
  | 'offices'
  | 'reports';

export type Action = 'view' | 'create' | 'edit' | 'delete' | 'manage';

export type Permissions = {
  [key in Resource]?: Action[];
};

export function hasPermission(
  userPermissions: Permissions,
  resource: Resource,
  action: Action
): boolean {
  const resourcePermissions = userPermissions[resource];
  if (!resourcePermissions) return false;
  
  if (resourcePermissions.includes('manage')) return true;
  
  return resourcePermissions.includes(action);
}

export function canViewResource(permissions: Permissions, resource: Resource): boolean {
  return hasPermission(permissions, resource, 'view');
}

export function canCreateResource(permissions: Permissions, resource: Resource): boolean {
  return hasPermission(permissions, resource, 'create');
}

export function canEditResource(permissions: Permissions, resource: Resource): boolean {
  return hasPermission(permissions, resource, 'edit');
}

export function canDeleteResource(permissions: Permissions, resource: Resource): boolean {
  return hasPermission(permissions, resource, 'delete');
}

export function canManageResource(permissions: Permissions, resource: Resource): boolean {
  return hasPermission(permissions, resource, 'manage');
}

export const DEFAULT_ROLES = {
  'Account Owner': {
    properties: ['view', 'create', 'edit', 'delete', 'manage'],
    leases: ['view', 'create', 'edit', 'delete', 'manage'],
    tenants: ['view', 'create', 'edit', 'delete', 'manage'],
    maintenance: ['view', 'create', 'edit', 'delete', 'manage'],
    payments: ['view', 'create', 'edit', 'delete', 'manage'],
    users: ['view', 'create', 'edit', 'delete', 'manage'],
    roles: ['view', 'create', 'edit', 'delete', 'manage'],
    settings: ['view', 'create', 'edit', 'delete', 'manage'],
    billing: ['view', 'create', 'edit', 'delete', 'manage'],
    offices: ['view', 'create', 'edit', 'delete', 'manage'],
    reports: ['view', 'create', 'edit', 'delete', 'manage'],
  } as Permissions,
  'Property Manager': {
    properties: ['view', 'create', 'edit'],
    leases: ['view', 'create', 'edit'],
    tenants: ['view', 'create', 'edit'],
    maintenance: ['view', 'create', 'edit', 'delete'],
    payments: ['view', 'create'],
    users: ['view'],
    offices: ['view'],
    reports: ['view'],
  } as Permissions,
  'Maintenance Coordinator': {
    properties: ['view'],
    maintenance: ['view', 'create', 'edit', 'delete', 'manage'],
    reports: ['view'],
  } as Permissions,
  'Leasing Agent': {
    properties: ['view'],
    leases: ['view', 'create', 'edit'],
    tenants: ['view', 'create', 'edit'],
    reports: ['view'],
  } as Permissions,
  'Viewer': {
    properties: ['view'],
    leases: ['view'],
    tenants: ['view'],
    maintenance: ['view'],
    payments: ['view'],
    reports: ['view'],
  } as Permissions,
};
