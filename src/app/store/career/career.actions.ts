import { createAction, props } from '@ngrx/store'
import { Career } from '@models/career'
import { Update } from '@ngrx/entity'

export const loadCareers = createAction(
  '[Career/API] Load Careers',
  props<{ force?: boolean }>()
)
export const loadCareersSuccess = createAction(
  '[Career/API] Load Careers Success',
  props<{ careers: Career[] }>()
)
export const loadCareersFailure = createAction(
  '[Career/API] Load Careers Failure',
  props<{ error: Error }>()
)

export const upsertCareer = createAction(
  '[Career/API] Upsert Career',
  props<{ career: Omit<Career, 'archived'> }>()
)
export const upsertCareerSuccess = createAction(
  '[Career/API] Upsert Career Success',
  props<{ career: Career }>()
)
export const upsertCareerFailure = createAction(
  '[Career/API] Upsert Career Failure',
  props<{ error: Error }>()
)

export const toggleArchived = createAction(
  '[User/API] Toggle Archived',
  props<{ career: Career }>()
)

export const toggleArchivedSuccess = createAction(
  '[User/API] Toggle Archived Success',
  props<{ career: Update<Career> }>()
)

export const toggleArchivedFailure = createAction(
  '[User/API] Toggle Archived Failure',
  props<{ error: Error }>()
)

export const clearCareers = createAction(
  '[Career/API] Clear Careers'
)
