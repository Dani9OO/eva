import { createFeatureSelector, createSelector } from '@ngrx/store'
import { UserState, usersFeatureKey, selectAll, selectEntities } from './user.reducer'

export const selectUserState = createFeatureSelector<UserState>(usersFeatureKey)

export const selectAllUsers = createSelector(
  selectUserState,
  selectAll
)

export const selectUserEntities = createSelector(
  selectUserState,
  selectEntities
)

export const selectLoading = createSelector(
  selectUserState,
  (state) => state.loading
)

export const selectFilteredUsers = (search: string) => createSelector(
  selectAllUsers,
  (users) => users.filter(u => u.name.includes(search))
)

export const selectUserById = (id: string) => createSelector(
  selectUserEntities,
  (users) => users[id]
)
