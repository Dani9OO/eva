import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects'
import { mergeMap, map, catchError, of, from } from 'rxjs'
import { UserService } from '../../services/user/user.service'
import { Store } from '@ngrx/store'
import { selectAllUsers } from './user.selectors'
import { UserActions } from '@store/user'

@Injectable()
export class UserEffects {
  public loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.loadUsers),
    concatLatestFrom(() => this.store.select(selectAllUsers)),
    mergeMap(([action, users]) => users.length === 0 || action.force
      ? this.users.getAppUsers()
      : from([users])
    ),
    map((users) => UserActions.loadUsersSuccess({ users })),
    catchError(error => of(UserActions.loadUsersFailure({ error })))
  ))

  public toggleAdmin$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.toggleAdmin),
    mergeMap((action) => this.users.toggleAdmin(action.user).pipe(
      map((user) => UserActions.toggleAdminSuccess({ user })),
      catchError((error) => of(UserActions.toggleAdminFailure({ error })))
    ))
  ))

  public constructor(
    private actions$: Actions,
    private users: UserService,
    private store: Store
  ) {}
}
