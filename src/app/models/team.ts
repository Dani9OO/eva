import { Group } from '@models/group'
export interface Project {
  name: string
  description: string
}

export interface Team {
  id?: string
  name: string
  career: string
  calendar: string
  group: string
  project: Project
  members: string[]
}

export interface TeamWithGroup extends Omit<Team, 'group'> {
  group?: Group
}
