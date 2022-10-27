import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectAll, CoordinatorState, coordinatorFeatureKey } from './coordinator.reducer'

export const selectCoordinatorState = createFeatureSelector<CoordinatorState>(coordinatorFeatureKey)

export const selectAllCoordinators = createSelector(
  selectCoordinatorState,
  selectAll
)

export const selectLoading = createSelector(
  selectCoordinatorState,
  (state) => state.loading
)

export const selectCoordinator = (calendar: string, career: string) => createSelector(
  selectAllCoordinators,
  (coordinators) => coordinators.find(coordinator => coordinator.calendar === calendar && coordinator.career === career)
)
