import { createAction, props } from '@ngrx/store'
import { Team } from '@models/team'

export const loadTeams = createAction(
  '[Team/API] Load Teams',
  props<{ calendar: string, career?: string }>()
)
export const loadTeamsSuccess = createAction(
  '[Team/API] Load Teams Success',
  props<{ teams: Team[] }>()
)
export const loadTeamsFailure = createAction(
  '[Team/API] Load Teams Failure',
  props<{ error: Error }>()
)

export const upsertTeam = createAction(
  '[Team/API] Upsert Team',
  props<{ team: Partial<Team> }>()
)
export const upsertTeamSuccess = createAction(
  '[Team/API] Upsert Team Success',
  props<{ team: Team }>()
)
export const upsertTeamFailure = createAction(
  '[Team/API] Upsert Team Failure',
  props<{ error: Error }>()
)

export const clearTeams = createAction(
  '[Team/API] Clear Teams'
)

export const leaveTeam = createAction(
  '[Team/API] Leave Team'
)
export const leaveTeamSuccess = createAction(
  '[Team/API] Leave Team Success',
  props<{ team: Team }>()
)
export const leaveTeamFailure = createAction(
  '[Team/API] Leave Team Failure',
  props<{ error: Error }>()
)

export const joinTeam = createAction(
  '[Team/API] Join Team',
  props<{ team: string }>()
)
export const joinTeamSuccess = createAction(
  '[Team/API] Join Team Success',
  props<{ team: Team }>()
)
export const joinTeamFailure = createAction(
  '[Team/API] Join Team Failure',
  props<{ error: Error }>()
)
