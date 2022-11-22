import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { mergeMap, map, catchError, of } from 'rxjs'
import { RubricService } from '@services/rubric'
import { UnexpectedError } from '@errors/unexpected'
import { tap } from 'rxjs/operators'
import { ToastController } from '@ionic/angular'
import { RubricActions } from '@store/rubric'
import { TeamActions } from '@store/team'

@Injectable()
export class RubricEffects {
  public upsertRubric$ = createEffect(() => this.actions$.pipe(
    ofType(RubricActions.upsertRubric),
    mergeMap(action => this.rubric.upsert(action.rubric).pipe(
      map((rubric) => RubricActions.upsertRubricSuccess({ rubric })),
      catchError(() => of(RubricActions.upsertRubricFailure({
        error: new UnexpectedError('upserting rubric')
      })))
    ))
  ))

  public upsertRubricFailure$ = createEffect(() => this.actions$.pipe(
    ofType(RubricActions.upsertRubricFailure),
    tap(action => {
      console.error(action.error)
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public loadRubrics$ = createEffect(() => this.actions$.pipe(
    ofType(RubricActions.loadRubrics),
    mergeMap(action => this.rubric.getRubrics(action.calendar, action.career).pipe(
      map(rubrics => RubricActions.loadRubricsSuccess({ rubrics })),
      catchError(() => of(RubricActions.loadRubricsFailure({
        error: new UnexpectedError('retrieving rubrics')
      })))
    ))
  ))

  public loadRubricsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(RubricActions.loadRubricsFailure),
    tap(action => {
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public deleteRubric$ = createEffect(() => this.actions$.pipe(
    ofType(RubricActions.deleteRubric),
    tap(action => this.rubric.delete(action.rubric))
  ), { dispatch: false })

  public loadTeams$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.loadTeams),
    map(action => RubricActions.loadRubrics({ calendar: action.calendar, career: action.career }))
  ))

  public constructor(
    private readonly actions$: Actions,
    private readonly rubric: RubricService,
    private readonly toast: ToastController
  ) {}
}
