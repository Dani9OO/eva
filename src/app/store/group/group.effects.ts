import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects'
import { mergeMap, map, catchError, of, asapScheduler, scheduled } from 'rxjs'
import { GroupService } from '@services/group'
import { UnexpectedError } from '@errors/unexpected'
import { tap, switchMap } from 'rxjs/operators'
import { ToastController } from '@ionic/angular'
import { GroupActions } from '@store/group'
import { Store } from '@ngrx/store'
import { selectGroups } from './group.selectors'
import { AppActions } from '@store/app'
import { TeamActions } from '@store/team'

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
    concatLatestFrom((action) => this.store.select(selectGroups(action.calendar, action.career))),
    mergeMap(([action, storeGroups]) => scheduled(
      storeGroups.length > 0 && !action.force
        ? [storeGroups]
        : this.group.getGroups(action.calendar, action.career),
      asapScheduler
    ).pipe(
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

  public loadGroup$ = createEffect(() => this.actions$.pipe(
    ofType(GroupActions.loadGroup),
    switchMap(action => this.group.findById(action.group)),
    map(group => GroupActions.loadGroupSuccess({ group })),
    catchError(error => of(GroupActions.loadGroupFailure({ error })))
  ))

  public setUserTeam$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.setUserTeam),
    map(action => GroupActions.loadGroup({ group: action.team.group }))
  ))

  public loadTeams$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.loadTeams),
    map(action => GroupActions.loadGroups({ career: action.career, calendar: action.calendar }))
  ))

  public constructor(
    private readonly actions$: Actions,
    private readonly group: GroupService,
    private readonly toast: ToastController,
    private readonly store: Store
  ) {}
}
