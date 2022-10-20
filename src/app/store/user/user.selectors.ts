import { AppUser } from '@models/user'
import { createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store'
import { UserState, usersFeatureKey, selectAll } from './user.reducer'

export const selectUserState = createFeatureSelector<UserState>(usersFeatureKey)

export const selectAllUsers = createSelector(
  selectUserState,
  selectAll
)

export const selectLoading = createSelector(
  selectUserState,
  (state) => state.loading
)

export const selectFilteredUsers = (search: string): MemoizedSelector<object, AppUser[], DefaultProjectorFn<AppUser[]>> => createSelector(
  selectAllUsers,
  (users) => users.filter(u => u.name.includes(search))
)
