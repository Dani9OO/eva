import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { Calendar } from 'src/app/models/calendar.model'
import * as CalendarActions from './calendar.actions'

export const calendarFeatureKey = 'calendar'

export interface CalendarState extends EntityState<Calendar> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Calendar> = createEntityAdapter<Calendar>()

export const initialState: CalendarState = adapter.getInitialState({
  // additional entity state properties
})

export const reducer = createReducer(
  initialState,
  on(CalendarActions.upsertCalendarSuccess,
    (state, action) => adapter.upsertOne(action.calendar, state)
  ),
  on(CalendarActions.loadCalendarsSuccess,
    (state, action) => adapter.setAll(action.calendars, state)
  ),
  on(CalendarActions.clearCalendars,
    state => adapter.removeAll(state)
  ),
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors()
