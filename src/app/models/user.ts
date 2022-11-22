import { Role } from '@models/role'
import { Team } from '@models/team'

export interface User {
  id: string
  name: string
  email: string
  domain: string
  photo: string
}

export interface AppUser extends User {
  role: Role,
  careers?: string[],
  team?: Team
}
