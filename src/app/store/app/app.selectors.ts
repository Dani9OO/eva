import { Role } from '@models/role'
import { createSelector, createFeatureSelector } from '@ngrx/store'
import { appFeatureKey, AppState } from './app.reducer'

export const selectAppState = createFeatureSelector<AppState>(appFeatureKey)

export const selectUser = createSelector(
  selectAppState,
  (state) => state.user
)

export const selectIsSignedIn = createSelector(
  selectUser,
  (user) => !!user
)

export const selectRole = createSelector(
  selectUser,
  (user) => user.role
)

export const selectIsRole = (role: Role) => createSelector(
  selectRole,
  (userRole) => userRole === role
)

export const selectTeam = createSelector(
  selectUser,
  (user) => user?.team
)

export const selectCalendar = createSelector(
  selectAppState,
  (state) => state.calendar
)
