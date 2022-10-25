import { createAction, props } from '@ngrx/store'
import { Group } from '@models/group'

export const loadGroups = createAction(
  '[Group/API] Load Groups',
  props<{ calendar: string, career: string }>()
)
export const loadGroupsSuccess = createAction(
  '[Group/API] Load Groups Success',
  props<{ groups: Group[] }>()
)
export const loadGroupsFailure = createAction(
  '[Group/API] Load Groups Failure',
  props<{ error: Error }>()
)

export const upsertGroups = createAction(
  '[Group/API] Upsert Groups',
  props<{ calendar: string, career: string, groups: Group[] }>()
)
export const upsertGroupsSuccess = createAction(
  '[Group/API] Upsert Groups Success',
  props<{ groups: Group[] }>()
)
export const upsertGroupsFailure = createAction(
  '[Group/API] Upsert Groups Failure',
  props<{ error: Error }>()
)

export const clearGroups = createAction(
  '[Group/API] Clear Groups'
)
