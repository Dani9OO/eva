import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { mergeMap, map, catchError, of } from 'rxjs'
import { CoordinatorService } from '@services/coordinator'
import { UnexpectedError } from '@errors/unexpected'
import { tap } from 'rxjs/operators'
import { ToastController } from '@ionic/angular'
import { CoordinatorActions } from '@store/coordinator'

@Injectable()
export class CoordinatorEffects {
  public upsertCoordinator$ = createEffect(() => this.actions$.pipe(
    ofType(CoordinatorActions.upsertCoordinator),
    mergeMap(action => this.coordinator.upsertCoordinator(action.coordinator).pipe(
      map((coordinator) => CoordinatorActions.upsertCoordinatorSuccess({ coordinator })),
      catchError(() => of(CoordinatorActions.upsertCoordinatorFailure({
        error: new UnexpectedError('upserting coordinator')
      })))
    ))
  ))

  public upsertCoordinatorFailure$ = createEffect(() => this.actions$.pipe(
    ofType(CoordinatorActions.upsertCoordinatorFailure),
    tap(action => {
      console.error(action.error)
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public upsertCoordinatorSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CoordinatorActions.upsertCoordinatorSuccess),
    map(action => CoordinatorActions.loadCoordinatorsSuccess({ coordinators: [action.coordinator] }))
  ))

  public loadCoordinators$ = createEffect(() => this.actions$.pipe(
    ofType(CoordinatorActions.loadCoordinators),
    mergeMap(action => this.coordinator.getCoordinators(action.calendar, action.career).pipe(
      map(coordinators => CoordinatorActions.loadCoordinatorsSuccess({ coordinators })),
      catchError(() => of(CoordinatorActions.loadCoordinatorsFailure({
        error: new UnexpectedError('retrieving coordinators')
      })))
    ))
  ))

  public loadCoordinatorsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(CoordinatorActions.loadCoordinatorsFailure),
    tap(action => {
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public constructor(
    private readonly actions$: Actions,
    private readonly coordinator: CoordinatorService,
    private readonly toast: ToastController
  ) {}
}
