import { createReducer, on } from '@ngrx/store';
import { Calendar } from './models/calendar.model';
import * as AppActions from './app.actions';
import { AppUser } from './models/user.model';

export interface AppState {
  app?: {
    calendar?: Calendar,
    user?: AppUser
  }
}

export const initialState: AppState = {

};

export const reducer = createReducer(
  initialState,
  on(AppActions.loginSuccess, (state, action) => ({ ...state, user: action.user })),
  on(AppActions.getCalendarSuccess, (state, action) => ({ ...state, calendar: action.calendar })),
  on(AppActions.logout, (state) => ({ ...state, user: undefined }))
);
