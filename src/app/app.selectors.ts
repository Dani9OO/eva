import { createSelector } from '@ngrx/store';
import { AppState } from './app.reducer';

export const selectFeature = (state: AppState) => state.app

export const selectUser = createSelector(
  selectFeature,
  (state) => state.user
)

export const selectCalendar = createSelector(
  selectFeature,
  (state) => state.calendar
)
