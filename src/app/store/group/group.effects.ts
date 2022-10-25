import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { mergeMap, map, catchError, of } from 'rxjs'
import { GroupService } from '@services/group'
import { UnexpectedError } from '@errors/unexpected'
import { tap } from 'rxjs/operators'
import { ToastController } from '@ionic/angular'
import { GroupActions } from '@store/group'

@Injectable()
export class GroupEffects {
  public upsertGroups$ = createEffect(() => this.actions$.pipe(
    ofType(GroupActions.upsertGroups),
    mergeMap(action => this.group.upsertGroups(action.calendar, action.career, action.groups).pipe(
      map((groups) => GroupActions.upsertGroupsSuccess({ groups })),
      catchError(() => of(GroupActions.upsertGroupsFailure({
        error: new UnexpectedError('upserting groups')
      })))
    ))
  ))

  public upsertGroupsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(GroupActions.upsertGroupsFailure),
    tap(action => {
      console.error(action.error)
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public loadGroups$ = createEffect(() => this.actions$.pipe(
    ofType(GroupActions.loadGroups),
    mergeMap(action => this.group.getGroups(action.calendar, action.career).pipe(
      map((groups) => GroupActions.loadGroupsSuccess({ groups })),
      catchError(() => of(GroupActions.loadGroupsFailure({
        error: new UnexpectedError('retrieving groups')
      })))
    ))
  ))

  public loadGroupsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(GroupActions.loadGroupsFailure),
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
    private readonly group: GroupService,
    private readonly toast: ToastController
  ) {}
}
