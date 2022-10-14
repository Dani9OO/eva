import { createAction, props } from '@ngrx/store'
import { Calendar } from 'src/app/models/calendar.model'

export const loadCalendars = createAction(
  '[Calendar/API] Load Calendars',
  props<{ force?: boolean }>()
)
export const loadCalendarsSuccess = createAction(
  '[Calendar/API] Load Calendars Success',
  props<{ calendars: Calendar[] }>()
)
export const loadCalendarsFailure = createAction(
  '[Calendar/API] Load Calendars Failure',
  props<{ error: Error }>()
)

export const upsertCalendar = createAction(
  '[Calendar/API] Upsert Calendar',
  props<{ start: string, end: string, id?: string }>()
)
export const upsertCalendarSuccess = createAction(
  '[Calendar/API] Upsert Calendar Success',
  props<{ calendar: Calendar }>()
)
export const upsertCalendarFailure = createAction(
  '[Calendar/API] Upsert Calendar Failure',
  props<{ error: Error }>()
)

export const selectCurrentCalendar = createAction(
  '[Calendar/API] Select Current Calendar',
  props<{ calendar: Calendar }>()
)
export const selectCurrentCalendarSuccess = createAction(
  '[Calendar/API] Select Current Calendar Success',
  props<{ id: string }>()
)
export const selectCurrentCalendarFailure = createAction(
  '[Calendar/API] Select Current Calendar Failure',
  props<{ error: Error }>()
)

export const clearCalendars = createAction(
  '[Calendar/API] Clear Calendars'
)
