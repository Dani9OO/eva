import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { mergeMap, from, map, catchError, of } from 'rxjs'
import { CareerService } from '@services/career'
import { UnexpectedError } from '@errors/unexpected'
import { tap } from 'rxjs/operators'
import { ToastController } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { CareerActions } from '@store/career'
import { selectAllCareers } from '@selectors/career'

@Injectable()
export class CareerEffects {
  public upsertCareer$ = createEffect(() => this.actions$.pipe(
    ofType(CareerActions.upsertCareer),
    mergeMap(action => this.career.upsertCareer(action.career).pipe(
      map((career) => CareerActions.upsertCareerSuccess({ career })),
      catchError(() => of(CareerActions.upsertCareerFailure({
        error: new UnexpectedError('upserting career')
      })))
    ))
  ))

  public upsertCareerFailure$ = createEffect(() => this.actions$.pipe(
    ofType(CareerActions.upsertCareerFailure),
    tap(action => {
      console.error(action.error)
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public loadCareers$ = createEffect(() => this.actions$.pipe(
    ofType(CareerActions.loadCareers),
    concatLatestFrom(() => this.store.select(selectAllCareers)),
    mergeMap(([action, storeCareers]) =>
      from(storeCareers.length === 0 || action.force ? this.career.getAll() : [storeCareers]).pipe(
        map((careers) => CareerActions.loadCareersSuccess({ careers })),
        catchError(() => of(CareerActions.loadCareersFailure({
          error: new UnexpectedError('retrieving careers')
        })))
      ))
  ))

  public loadCareersFailure$ = createEffect(() => this.actions$.pipe(
    ofType(CareerActions.loadCareersFailure),
    tap(action => {
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public toggleArchived$ = createEffect(() => this.actions$.pipe(
    ofType(CareerActions.toggleArchived),
    mergeMap((action) => this.career.toggleArchived(action.career).pipe(
      map((career) => CareerActions.toggleArchivedSuccess({ career })),
      catchError((error) => of(CareerActions.toggleArchivedFailure({ error })))
    ))
  ))

  public constructor(
    private readonly actions$: Actions,
    private readonly career: CareerService,
    private readonly toast: ToastController,
    private readonly store: Store
  ) {}
}
