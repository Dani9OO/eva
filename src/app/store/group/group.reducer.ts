import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { Group } from '@models/group'
import { GroupActions } from '@store/group'

export const groupFeatureKey = 'group'

export interface GroupState extends EntityState<Group> {
  loading: boolean
}

export const adapter: EntityAdapter<Group> = createEntityAdapter<Group>()

export const initialState: GroupState = adapter.getInitialState({
  loading: false
})

export const reducer = createReducer(
  initialState,
  on(GroupActions.upsertGroupsSuccess,
    (state, action) => adapter.upsertMany(action.groups, state)
  ),
  on(GroupActions.loadGroups,
    (state): GroupState => ({ ...state, loading: true })
  ),
  on(GroupActions.loadGroupsSuccess,
    (state, action) => adapter.upsertMany(action.groups, { ...state, loading: false })
  ),
  on(GroupActions.loadGroupsFailure,
    (state): GroupState => ({ ...state, loading: false })
  ),
  on(GroupActions.clearGroups,
    state => adapter.removeAll(state)
  )
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors()
