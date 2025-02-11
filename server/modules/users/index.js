// server/modules/users/index.js
export { UserModel } from './usersModel.js'
export { UserService } from './usersService.js'

// Export any additional user-related constants or types
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
}
