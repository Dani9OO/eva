import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { mergeMap, map, catchError, of } from 'rxjs'
import { AssessmentService } from '@services/assessment'
import { UnexpectedError } from '@errors/unexpected'
import { tap } from 'rxjs/operators'
import { ToastController } from '@ionic/angular'
import { AssessmentActions } from '@store/assessment'
import { TeamActions } from '@store/team'

@Injectable()
export class AssessmentEffects {
  public upsertAssessment$ = createEffect(() => this.actions$.pipe(
    ofType(AssessmentActions.upsertAssessment),
    mergeMap(action => this.assessment.upsert(action.assessment).pipe(
      map((assessment) => AssessmentActions.upsertAssessmentSuccess({ assessment })),
      catchError(() => of(AssessmentActions.upsertAssessmentFailure({
        error: new UnexpectedError('upserting assessment')
      })))
    ))
  ))

  public upsertAssessmentFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AssessmentActions.upsertAssessmentFailure),
    tap(action => {
      console.error(action.error)
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public loadAssessments$ = createEffect(() => this.actions$.pipe(
    ofType(AssessmentActions.loadAssessments),
    mergeMap(action => this.assessment.getAssessments(action.calendar).pipe(
      map(assessments => AssessmentActions.loadAssessmentsSuccess({ assessments })),
      catchError(() => of(AssessmentActions.loadAssessmentsFailure({
        error: new UnexpectedError('retrieving assessments')
      })))
    ))
  ))

  public loadAssessmentsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AssessmentActions.loadAssessmentsFailure),
    tap(action => {
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public loadCareerAssessments$ = createEffect(() => this.actions$.pipe(
    ofType(AssessmentActions.loadCareerAssessments),
    mergeMap(action => this.assessment.getAssessments(action.calendar, action.career).pipe(
      map(assessments => AssessmentActions.loadCareerAssessmentsSuccess({ assessments })),
      catchError(() => of(AssessmentActions.loadCareerAssessmentsFailure({
        error: new UnexpectedError('retrieving assessments')
      })))
    ))
  ))

  public loadCareerAssessmentsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AssessmentActions.loadCareerAssessmentsFailure),
    tap(action => {
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public loadTeams$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.loadTeams),
    map(action => AssessmentActions.loadCareerAssessments({ calendar: action.calendar, career: action.career }))
  ))

  public constructor(
    private readonly actions$: Actions,
    private readonly assessment: AssessmentService,
    private readonly toast: ToastController
  ) {}
}
