import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UserState, usersFeatureKey, selectAll } from './user.reducer'

export const selectUserState = createFeatureSelector<UserState>(usersFeatureKey)

export const selectAllUsers = createSelector(
  selectUserState,
  selectAll
)
