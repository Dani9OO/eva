import { createAction, props } from '@ngrx/store'
import { Update } from '@ngrx/entity'
import { AppUser } from '@models/user'

export const loadUsers = createAction(
  '[User/API] Load Users',
  props<{ force?: boolean }>()
)

export const loadUsersSuccess = createAction(
  '[User/API] Load Users Success',
  props<{ users: AppUser[] }>()
)

export const loadUsersFailure = createAction(
  '[User/API] Load Users Failure',
  props<{ error: Error }>()
)

export const loadUser = createAction(
  '[User/API] Load User',
  props<{ id: string }>()
)

export const loadUserSuccess = createAction(
  '[User/API] Load User Success',
  props<{ user: AppUser }>()
)

export const loadUserFailure = createAction(
  '[User/API] Load User Failure',
  props<{ error: Error }>()
)

export const toggleAdmin = createAction(
  '[User/API] Toggle Admin',
  props<{ user: AppUser }>()
)

export const toggleAdminSuccess = createAction(
  '[User/API] Toggle Admin Success',
  props<{ user: Update<AppUser> }>()
)

export const toggleAdminFailure = createAction(
  '[User/API] Toggle Admin Failure',
  props<{ error: Error }>()
)

export const updateUser = createAction(
  '[User/API] Update User',
  props<{ user: Update<AppUser> }>()
)
