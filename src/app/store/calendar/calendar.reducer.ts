import { createReducer, on } from '@ngrx/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { Calendar } from '@models/calendar'
import { CalendarActions } from '@store/calendar'

export const calendarFeatureKey = 'calendar'

export interface CalendarState extends EntityState<Calendar> {
  loading: boolean
}

export const adapter: EntityAdapter<Calendar> = createEntityAdapter<Calendar>()

export const initialState: CalendarState = adapter.getInitialState({
  loading: false
})

export const reducer = createReducer(
  initialState,
  on(CalendarActions.upsertCalendarSuccess,
    (state, action) => adapter.upsertOne(action.calendar, state)
  ),
  on(CalendarActions.loadCalendars,
    (state, action): CalendarState => ({ ...state, loading: action.force || state.ids.length === 0 })
  ),
  on(CalendarActions.loadCalendarsSuccess,
    (state, action) => adapter.setAll(action.calendars, { ...state, loading: false })
  ),
  on(CalendarActions.loadCalendarsFailure,
    (state, action): CalendarState => ({ ...state, loading: false })
  ),
  on(CalendarActions.clearCalendars,
    state => adapter.removeAll(state)
  )
)

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors()
