import { createAction, props } from '@ngrx/store';
import { Calendar } from './models/calendar.model';
import { AppUser } from './models/user.model';

export const getCalendar = createAction(
  '[App] Get Calendar'
);

export const getCalendarSuccess = createAction(
  '[App] Get Calendar Success',
  props<{ calendar: Calendar }>()
);

export const getCalendarFailure = createAction(
  '[App] Get Calendar Failure',
  props<{ error: Error }>()
);

export const login = createAction(
  '[App] Login'
);

export const autoLogin = createAction(
  '[App] Auto Login'
);

export const loginSuccess = createAction(
  '[App] Login Success',
  props<{ user: AppUser }>()
);

export const loginFailure = createAction(
  '[App] Login Failure',
  props<{ error: Error }>()
);

export const logout = createAction(
  '[App] Logout'
);
