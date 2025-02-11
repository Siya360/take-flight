// server/modules/admin/index.js
export { AdminModel, ADMIN_PERMISSIONS, ADMIN_DEPARTMENTS } from './adminModel.js'
export { AdminService } from './adminService.js'

export const ADMIN_EVENTS = {
  ADMIN_CREATED: 'admin.created',
  ADMIN_UPDATED: 'admin.updated',
  ADMIN_DEACTIVATED: 'admin.deactivated',
  ADMIN_REACTIVATED: 'admin.reactivated',
  PERMISSIONS_UPDATED: 'admin.permissions.updated'
}
