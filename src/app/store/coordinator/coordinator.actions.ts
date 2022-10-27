import { createAction, props } from '@ngrx/store'
import { Coordinator } from '@models/coordinator'

export const loadCoordinators = createAction(
  '[Coordinator/API] Load Coordinators',
  props<{ calendar: string, career: string }>()
)
export const loadCoordinatorsSuccess = createAction(
  '[Coordinator/API] Load Coordinators Success',
  props<{ coordinators: Coordinator[] }>()
)
export const loadCoordinatorsFailure = createAction(
  '[Coordinator/API] Load Coordinators Failure',
  props<{ error: Error }>()
)

export const upsertCoordinator = createAction(
  '[Coordinator/API] Upsert Coordinator',
  props<{ coordinator: Coordinator }>()
)
export const upsertCoordinatorSuccess = createAction(
  '[Coordinator/API] Upsert Coordinator Success',
  props<{ coordinator: Coordinator }>()
)
export const upsertCoordinatorFailure = createAction(
  '[Coordinator/API] Upsert Coordinator Failure',
  props<{ error: Error }>()
)

export const clearCoordinators = createAction(
  '[Coordinator/API] Clear Coordinators'
)
