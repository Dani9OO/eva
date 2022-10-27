import { createAction, props } from '@ngrx/store'
import { Rubric } from '@models/rubric'

export const loadRubrics = createAction(
  '[Rubric/API] Load Rubrics',
  props<{ calendar: string, career: string }>()
)
export const loadRubricsSuccess = createAction(
  '[Rubric/API] Load Rubrics Success',
  props<{ rubrics: Rubric[] }>()
)
export const loadRubricsFailure = createAction(
  '[Rubric/API] Load Rubrics Failure',
  props<{ error: Error }>()
)

export const upsertRubric = createAction(
  '[Rubric/API] Upsert Rubric',
  props<{ rubric: Rubric }>()
)
export const upsertRubricSuccess = createAction(
  '[Rubric/API] Upsert Rubric Success',
  props<{ rubric: Rubric }>()
)
export const upsertRubricFailure = createAction(
  '[Rubric/API] Upsert Rubric Failure',
  props<{ error: Error }>()
)

export const clearRubrics = createAction(
  '[Rubric/API] Clear Rubrics'
)
