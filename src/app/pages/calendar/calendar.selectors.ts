import { createFeatureSelector, createSelector } from '@ngrx/store'
import { selectAll, CalendarState, calendarFeatureKey } from './calendar.reducer'

export const selectCalendarState = createFeatureSelector<CalendarState>(calendarFeatureKey)



export const selectAllCalendars = createSelector(
  selectCalendarState,
  selectAll
)
