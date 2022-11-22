import { createAction, props } from '@ngrx/store'
import { Assessment } from '@models/assessment'

export const loadAssessments = createAction(
  '[Assessment/API] Load Assessments',
  props<{ calendar: string }>()
)
export const loadAssessmentsSuccess = createAction(
  '[Assessment/API] Load Assessments Success',
  props<{ assessments: Assessment[] }>()
)
export const loadAssessmentsFailure = createAction(
  '[Assessment/API] Load Assessments Failure',
  props<{ error: Error }>()
)

export const loadCareerAssessments = createAction(
  '[Assessment/API] Load Career Assessments',
  props<{ calendar: string, career: string }>()
)
export const loadCareerAssessmentsSuccess = createAction(
  '[Assessment/API] Load Career Assessments Success',
  props<{ assessments: Assessment[] }>()
)
export const loadCareerAssessmentsFailure = createAction(
  '[Assessment/API] Load Career Assessments Failure',
  props<{ error: Error }>()
)

export const upsertAssessment = createAction(
  '[Assessment/API] Upsert Assessment',
  props<{ assessment: Assessment }>()
)
export const upsertAssessmentSuccess = createAction(
  '[Assessment/API] Upsert Assessment Success',
  props<{ assessment: Assessment }>()
)
export const upsertAssessmentFailure = createAction(
  '[Assessment/API] Upsert Assessment Failure',
  props<{ error: Error }>()
)

export const clearAssessments = createAction(
  '[Assessment/API] Clear Assessments'
)
