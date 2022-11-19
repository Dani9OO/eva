import { selectUser, selectCalendar, selectTeam } from '@selectors/app'
import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { mergeMap, map, catchError, of, zip } from 'rxjs'
import { TeamService } from '@services/team'
import { UnexpectedError } from '@errors/unexpected'
import { tap, switchMap } from 'rxjs/operators'
import { ToastController } from '@ionic/angular'
import { TeamActions } from '@store/team'
import { AppActions } from '@store/app'
import { Store } from '@ngrx/store'
import { Team } from '@models/team'

@Injectable()
export class TeamEffects {
  public upsertTeam$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.upsertTeam),
    concatLatestFrom(() => zip(this.store.select(selectUser), this.store.select(selectCalendar))),
    mergeMap(([action, [user, calendar]]) => this.team.upsert({
      ...(action.team as Team),
      calendar: calendar.id,
      members: action.team.members || [user.id]
    }).pipe(
      map((team) => TeamActions.upsertTeamSuccess({ team })),
      catchError(() => of(TeamActions.upsertTeamFailure({
        error: new UnexpectedError('upserting team')
      })))
    ))
  ))

  public upsertTeamFailure$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.upsertTeamFailure),
    tap(action => {
      console.error(action.error)
      this.toast.create({
        message: action.error.message,
        buttons: [{ text: 'OK', role: 'cancel' }],
        duration: 3000
      }).then(toast => toast.present())
    })
  ), { dispatch: false })

  public upsertTeamSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.upsertTeamSuccess),
    map(action => AppActions.setUserTeam({ team: action.team }))
  ))

  public joinTeam$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.joinTeam),
    concatLatestFrom(() => this.store.select(selectUser)),
    switchMap(([action, user]) => this.team.updateTeamMembers(action.team, user.id, 'push')),
    map(team => TeamActions.joinTeamSuccess({ team })),
    catchError(error => of(TeamActions.joinTeamFailure({ error })))
  ))

  public leaveTeam$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.leaveTeam),
    concatLatestFrom(() => zip(this.store.select(selectUser), this.store.select(selectTeam))),
    switchMap(([_action, [user, team]]) => this.team.updateTeamMembers(team.id, user.id, 'pull')),
    map(team => TeamActions.leaveTeamSuccess({ team })),
    catchError(error => of(TeamActions.leaveTeamFailure({ error })))
  ))

  public joinTeamSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.joinTeamSuccess),
    map(action => AppActions.setUserTeam({ team: action.team }))
  ))

  public leaveTeamSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.leaveTeamSuccess),
    map(() => AppActions.setUserTeam({ team: undefined }))
  ))

  public loadTeams$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.loadTeams),
    mergeMap(action => this.team.getTeams(action.calendar, action.career).pipe(
      map(teams => TeamActions.loadTeamsSuccess({ teams })),
      catchError(() => of(TeamActions.loadTeamsFailure({
        error: new UnexpectedError('retrieving teams')
      })))
    ))
  ))

  public loadTeamsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(TeamActions.loadTeamsFailure),
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
    private readonly team: TeamService,
    private readonly toast: ToastController,
    private readonly store: Store
  ) {}
}
