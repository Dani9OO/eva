import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { AppUser } from '@models/user'
import { UserActions } from '@store/user'

export const usersFeatureKey = 'users'

export interface UserState extends EntityState<AppUser> {
  // additional entities state properties
}

export const adapter: EntityAdapter<AppUser> = createEntityAdapter<AppUser>()

export const initialState: UserState = adapter.getInitialState({
  // additional entity state properties
})

export const reducer = createReducer(
  initialState,
  on(UserActions.updateUser,
    (state, action) => adapter.updateOne(action.user, state)
  ),
  on(UserActions.loadUsersSuccess,
    (state, action) => adapter.setAll(action.users, state)
  ),
  on(UserActions.toggleAdminSuccess,
    (state, action) => adapter.updateOne(action.user, state)
  )
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors()
