import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects'
import { mergeMap, map, catchError, of, from, zip } from 'rxjs'
import { UserService } from '@services/user'
import { Store } from '@ngrx/store'
import { selectAllUsers } from '@selectors/user'
import { UserActions } from '@store/user'
import { selectCalendar } from '@selectors/app'
import { CoordinatorActions } from '@store/coordinator'
import { switchMap, tap } from 'rxjs/operators'
import { NotFoundError } from '@errors/not-found'
import { environment } from 'src/environments/environment'

@Injectable()
export class UserEffects {
  public loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.loadUsers),
    concatLatestFrom(() => zip(this.store.select(selectAllUsers), this.store.select(selectCalendar))),
    mergeMap(([action, [users, calendar]]) => users.length === 0 || action.force
      ? this.users.getAppUsers(calendar.id)
      : from([users])
    ),
    map((users) => UserActions.loadUsersSuccess({ users })),
    catchError(error => of(UserActions.loadUsersFailure({ error })))
  ))

  public loadUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.loadUser),
    concatLatestFrom(() => this.store.select(selectCalendar)),
    mergeMap(([action, calendar]) => this.users.getUser(action.id).pipe(
      switchMap(user => this.users.getRoles(user, calendar.id)),
      map(user => UserActions.loadUserSuccess({ user })),
      catchError(error => of(UserActions.loadUserFailure({ error })))
    ))
  ))

  public errors$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.loadUserFailure),
    tap(action => {
      if (!environment.production) console.error(action.error)
    })
  ), { dispatch: false })

  public loadCoordinators$ = createEffect(() => this.actions$.pipe(
    ofType(CoordinatorActions.loadCoordinatorsSuccess),
    map(action => action.coordinators.length > 1
      ? UserActions.loadUsers({})
      : action.coordinators[0]?.user
        ? UserActions.loadUser({ id: action.coordinators[0].user })
        : UserActions.loadUserFailure({ error: new NotFoundError('user', 'career coordinator') })
    )
  ))

  public toggleAdmin$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.toggleAdmin),
    mergeMap((action) => this.users.toggleAdmin(action.user).pipe(
      map((user) => UserActions.toggleAdminSuccess({ user })),
      catchError((error) => of(UserActions.toggleAdminFailure({ error })))
    ))
  ))

  public constructor(
    private readonly actions$: Actions,
    private readonly users: UserService,
    private readonly store: Store
  ) {}
}
