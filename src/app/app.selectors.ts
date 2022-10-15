import { createSelector } from '@ngrx/store'
import { AppState } from './app.reducer'

export const selectFeature: (state: { app: AppState; }) => AppState = (state: { app: AppState }) => state.app

export const selectUser = createSelector(
  selectFeature,
  (state) => state.user
)

export const selectCalendar = createSelector(
  selectFeature,
  (state) => state.calendar
)
