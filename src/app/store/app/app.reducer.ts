import { createReducer, on } from '@ngrx/store'
import { AppUser } from '@models/user'
import { AppActions } from '@store/app'

export const appFeatureKey = 'app'

export interface AppState {
  calendar?: string,
  user?: AppUser
}

export const initialState: AppState = {

}

export const reducer = createReducer(
  initialState,
  on(AppActions.loginSuccess, (state, action): AppState => ({ ...state, user: action.user })),
  on(AppActions.getCalendarSuccess, (state, action): AppState => ({ ...state, calendar: action.calendar })),
  on(AppActions.logout, (state): AppState => ({ ...state, user: undefined }))
)
