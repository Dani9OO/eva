import { Role } from '@models/role'

export interface User {
  id: string
  name: string
  email: string
  domain: string
  photo: string
}

export interface AppUser extends User {
  role: Role,
  permissions: string[]
}
