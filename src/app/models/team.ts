import { Group } from '@models/group'
import { Career } from '@models/career'
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

export interface PopulatedTeam extends Omit<TeamWithGroup, 'career'> {
  career: Career
  grade: number
}
