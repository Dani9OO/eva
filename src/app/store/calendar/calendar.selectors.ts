import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectAll, CalendarState, calendarFeatureKey, selectEntities } from './calendar.reducer'

export const selectCalendarState = createFeatureSelector<CalendarState>(calendarFeatureKey)

export const selectAllCalendars = createSelector(
  selectCalendarState,
  selectAll
)

export const selectLoading = createSelector(
  selectCalendarState,
  (state) => state.loading
)

export const selectCalendarEntities = createSelector(
  selectCalendarState,
  selectEntities
)

export const selectCalendarById = (id: string) => createSelector(
  selectCalendarEntities,
  (calendars) => calendars[id]
)
