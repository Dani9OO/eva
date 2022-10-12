import { Role } from '../common/types/role.type';
export interface User {
  uid: string
  name: string
  email: string
  photo: string
}

export interface AppUser extends User {
  role: Role,
  permissions: string[]
}
