import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { catchError, map, of, firstValueFrom } from 'rxjs'
import { AppActions } from '@store/app'
import { CalendarService } from '@services/calendar'
import { Router } from '@angular/router'
import { tap, switchMap } from 'rxjs/operators'
import { ToastController } from '@ionic/angular'
import { UserService } from '@services/user'
import { SpinnerService } from '@services/spinner'
import { Store } from '@ngrx/store'
import { selectUser } from '@selectors/app'
import { UnauthorizedError } from '@errors/unauthorized'
import { Role } from '@models/role'

@Injectable()
export class AppEffects {
  public getCalendar$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getCalendar),
    switchMap(() => this.calendars.getCurrentCalendar()),
    map(calendar => AppActions.getCalendarSuccess({ calendar })),
    catchError(error => of(AppActions.getCalendarFailure({ error })))
  ))

  public getCalendarFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.getCalendarFailure),
    tap(() => this.noCalendar())
  ), { dispatch: false })

  public autoLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.autoLogin),
    map(action => AppActions.loginMiddleware({ user: action.user })),
    catchError(error => of(AppActions.loginFailure({ error })))
  ))

  public login$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.login),
    map(action => AppActions.loginMiddleware({ user: action.user })),
    catchError(error => of(AppActions.loginFailure({ error })))
  ))

  public loginMiddleware$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.loginMiddleware),
    switchMap(action => this.user.updateUserData(action.user)),
    switchMap(user => this.user.getRoles(user)),
    map(user => AppActions.loginSuccess({ user })),
    catchError(error => of(AppActions.loginFailure({ error })))
  ))

  public loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.loginSuccess),
    tap(action => {
      this.spinner.stop()
      this.loginNavigate(action.user.role)
    })
  ), { dispatch: false })

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

  public constructor(
    private readonly actions$: Actions,
    private readonly calendars: CalendarService,
    private readonly user: UserService,
    private readonly router: Router,
    private readonly toast: ToastController,
    private readonly spinner: SpinnerService,
    private readonly store: Store
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
