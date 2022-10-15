import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, mergeMap, of, from, firstValueFrom } from 'rxjs'
import * as AppActions from './app.actions'
import { CalendarService } from './services/calendar/calendar.service'
import { Router } from '@angular/router'
import { tap, switchMap } from 'rxjs/operators'
import { ToastController } from '@ionic/angular'
import { AuthService } from './services/auth/auth.service'
import { UserService } from './services/user/user.service'
import { Auth, authState } from '@angular/fire/auth'
import { SpinnerService } from './services/spinner/spinner.service'
import { Store } from '@ngrx/store'
import { selectUser } from './app.selectors'
import { Role } from './common/types/role.type'
import { UnauthorizedError } from './common/errors/unauthorized.error'

@Injectable()
export class AppEffects {
  public getCalendar$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getCalendar),
    mergeMap(() => this.calendars.getCurrentCalendar().pipe(
      map(calendar => AppActions.getCalendarSuccess({ calendar })),
      catchError(error => of(AppActions.getCalendarFailure({ error })))
    ))
  ))

  public getCalendarSuccess = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getCalendarSuccess),
    tap(() => this.spinner.stop())
  ), { dispatch: false })

  public getCalendarFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getCalendarFailure),
    tap(() => this.noCalendar())
  ), { dispatch: false })

  public login$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.login),
    tap(() => this.spinner.spin()),
    mergeMap(() => authState(this.fireauth).pipe(
      switchMap(user => from(user ? [user] : this.auth.signIn())),
      switchMap(user => this.user.updateUserData(user)),
      switchMap(user => from(this.user.getRoles(user))),
      map(user => AppActions.loginSuccess({ user })),
      catchError(error => of(AppActions.loginFailure({ error })))
    ))
  ))

  public loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.loginSuccess),
    tap((action) => this.loginNavigate(action.user.role)),
    map(() => AppActions.getCalendar())
  ))

  public loginFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.loginFailure),
    tap(action => {
      this.spinner.stop()
      if (action.error instanceof UnauthorizedError) {
        this.toast.create({
          message: action.error.message,
          duration: 3000,
          buttons: [{ text: 'OK', role: 'cancel' }]
        }).then(toast => toast.present())
      }
    })
  ), { dispatch: false })

  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.logout),
    tap(() => this.auth.signOut().finally(() => this.router.navigate(['/auth'], { replaceUrl: true })))
  ), { dispatch: false })

  public constructor(
    private actions$: Actions,
    private calendars: CalendarService,
    private fireauth: Auth,
    private auth: AuthService,
    private user: UserService,
    private router: Router,
    private toast: ToastController,
    private spinner: SpinnerService,
    private store: Store
  ) {}

  private async noCalendar(): Promise<void> {
    const role = (await firstValueFrom(this.store.select(selectUser))).role
    this.spinner.stop()
    if (role === 'admin') {
      this.router.navigate(['/calendar'])
      const toast = await this.toast.create({
        message: 'Es necesario seleccionar un ciclo escolar para proceder.',
        duration: 3000,
        buttons: [{ text: 'OK', role: 'cancel' }]
      })
      await toast.present()
    } else {
      this.store.dispatch(AppActions.logout())
      const toast = await this.toast.create({
        message: 'No hay un ciclo escolar en curso, cerrando sesión...',
        duration: 3000,
        buttons: [{ text: 'OK', role: 'cancel' }]
      })
      await toast.present()
    }
  }

  private loginNavigate(role: Role): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/summary'], { replaceUrl: true })
        break

      default:
        break
    }
  }
}
