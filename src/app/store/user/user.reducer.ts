import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { AppUser } from '@models/user'
import { UserActions } from '@store/user'

export const usersFeatureKey = 'users'

export interface UserState extends EntityState<AppUser> {
  loading: boolean
}

export const adapter: EntityAdapter<AppUser> = createEntityAdapter<AppUser>()

export const initialState: UserState = adapter.getInitialState({
  loading: false
})

export const reducer = createReducer(
  initialState,
  on(UserActions.updateUser,
    (state, action) => adapter.updateOne(action.user, state)
  ),
  on(UserActions.loadUsers,
    (state, action): UserState => ({ ...state, loading: action.force || state.ids.length === 0 })
  ),
  on(UserActions.loadUsersSuccess,
    (state, action) => adapter.setAll(action.users, ({ ...state, loading: false }))
  ),
  on(UserActions.loadUserSuccess,
    (state, action) => adapter.upsertOne(action.user, state)
  ),
  on(UserActions.loadUsersFailure,
    (state): UserState => ({ ...state, loading: false })
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
