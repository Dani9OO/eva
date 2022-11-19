import { createAction, props } from '@ngrx/store'
import { AppUser } from '@models/user'
import { User as FirebaseUser } from 'firebase/auth'
import { Calendar } from '@models/calendar'
import { Team } from '@models/team'
import { Role } from '@models/role'

export const getCalendar = createAction(
  '[App] Get Calendar'
)

export const getCalendarSuccess = createAction(
  '[App] Get Calendar Success',
  props<{ calendar: Calendar }>()
)

export const getCalendarFailure = createAction(
  '[App] Get Calendar Failure',
  props<{ error: Error }>()
)

export const login = createAction(
  '[App] Login',
  props<{ user: FirebaseUser }>()
)

export const autoLogin = createAction(
  '[App] Auto Login',
  props<{ user: FirebaseUser }>()
)

export const loginMiddleware = createAction(
  '[App] Login Middleware',
  props<{ user: FirebaseUser }>()
)

export const loginSuccess = createAction(
  '[App] Login Success',
  props<{ user: AppUser }>()
)

export const loginFailure = createAction(
  '[App] Login Failure',
  props<{ error: Error }>()
)

export const logout = createAction(
  '[App] Logout'
)

export const findUserTeam = createAction(
  '[App] Find User Team',
  props<{ calendar: string, user: string, role: Role }>()
)

export const setUserTeam = createAction(
  '[App] Set User Team',
  props<{ team?: Team }>()
)

export const findUserTeamFailure = createAction(
  '[App] Find User Team Failure',
  props<{ error: Error }>()
)
