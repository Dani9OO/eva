import { createAction, props } from '@ngrx/store'
import { AppUser } from '@models/user'
import { User as FirebaseUser } from 'firebase/auth'

export const getCalendar = createAction(
  '[App] Get Calendar'
)

export const getCalendarSuccess = createAction(
  '[App] Get Calendar Success',
  props<{ calendar: string }>()
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
