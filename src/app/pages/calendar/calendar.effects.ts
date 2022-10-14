import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import * as CalendarActions from './calendar.actions'
import { mergeMap, from, map, catchError, of } from 'rxjs'
import { CalendarService } from '../../services/calendar/calendar.service'
import { UnexpectedError } from '../../common/errors/unexpected.error'
import { tap } from 'rxjs/operators'
import { ToastController } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { selectAllCalendars } from './calendar.selectors'
import * as AppActions from 'src/app/app.actions'


@Injectable()
export class CalendarEffects {

  upsertCalendar$ = createEffect(() => this.actions$.pipe(
    ofType(CalendarActions.upsertCalendar),
    mergeMap(action => this.calendar.upsertCalendar(action.start, action.end, action.id).pipe(
      map((calendar) => CalendarActions.upsertCalendarSuccess({ calendar })),
      catchError(() => of(CalendarActions.upsertCalendarFailure({
        error: new UnexpectedError('upserting calendar')
      })))
    ))
  ))

  upsertCalendarFailure$ = createEffect(() => this.actions$.pipe(
    ofType(CalendarActions.upsertCalendarFailure),
    tap(action => {
      console.error(action.error)
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  loadCalendars$ = createEffect(() => this.actions$.pipe(
    ofType(CalendarActions.loadCalendars),
    concatLatestFrom(() => this.store.select(selectAllCalendars)),
    mergeMap(([action, storeCalendars]) =>
      from(storeCalendars.length === 0 || action.force ? this.calendar.getAllCalendars() : [storeCalendars]
    ).pipe(
      map((calendars) => CalendarActions.loadCalendarsSuccess({ calendars })),
      catchError(() => of(CalendarActions.loadCalendarsFailure({
        error: new UnexpectedError('retrieving calendars')
      })))
    ))
  ))

  loadCalendarsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(CalendarActions.loadCalendarsFailure),
    tap(action => {
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  selectCurrentCalendar$ = createEffect(() => this.actions$.pipe(
    ofType(CalendarActions.selectCurrentCalendar),
    mergeMap(action => this.calendar.selectCurrentCalendar(action.calendar).pipe(
      map(calendar => CalendarActions.selectCurrentCalendarSuccess({ ...calendar })),
      catchError(() => of(CalendarActions.selectCurrentCalendarFailure({
        error: new UnexpectedError('selecting current calendar')
      })))
    ))
  ))

  selectCurrentCalendarSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CalendarActions.selectCurrentCalendarSuccess),
    map(() => AppActions.getCalendar())
  ))

  constructor(
    private readonly actions$: Actions,
    private readonly calendar: CalendarService,
    private readonly toast: ToastController,
    private readonly store: Store
  ) {}
}
