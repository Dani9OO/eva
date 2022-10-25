import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectAll, GroupState, groupFeatureKey, selectEntities } from './group.reducer'

export const selectGroupState = createFeatureSelector<GroupState>(groupFeatureKey)

export const selectAllGroups = createSelector(
  selectGroupState,
  selectAll
)

export const selectLoading = createSelector(
  selectGroupState,
  (state) => state.loading
)

export const selectGroupEntities = createSelector(
  selectGroupState,
  selectEntities
)

export const selectGroupById = (id: string) => createSelector(
  selectGroupEntities,
  (groups) => groups[id]
)

export const selectGroups = (calendar: string, career: string) => createSelector(
  selectAllGroups,
  (groups) => groups.filter(group => group.calendar === calendar && group.career === career)
)
