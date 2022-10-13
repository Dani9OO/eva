import { createAction, props } from '@ngrx/store';
import { Calendar } from 'src/app/models/calendar.model';

export const loadCalendars = createAction(
  '[Calendar/API] Load Calendars',
  props<{ force?: boolean }>()
);
export const loadCalendarsSuccess = createAction(
  '[Calendar/API] Load Calendars Success',
  props<{ calendars: Calendar[] }>()
);
export const loadCalendarsFailure = createAction(
  '[Calendar/API] Load Calendars Failure',
  props<{ error: Error }>()
);

export const upsertCalendar = createAction(
  '[Calendar/API] Upsert Calendar',
  props<{ start: string, end: string, active?: boolean, id?: string }>()
);
export const upsertCalendarSuccess = createAction(
  '[Calendar/API] Upsert Calendar Success',
  props<{ calendar: Calendar }>()
);
export const upsertCalendarFailure = createAction(
  '[Calendar/API] Upsert Calendar Failure',
  props<{ error: Error }>()
);

export const clearCalendars = createAction(
  '[Calendar/API] Clear Calendars'
);
