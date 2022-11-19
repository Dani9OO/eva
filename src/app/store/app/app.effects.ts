import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects'
import { catchError, map, of, firstValueFrom } from 'rxjs'
import { AppActions } from '@store/app'
import { CalendarService } from '@services/calendar'
import { tap, switchMap } from 'rxjs/operators'
import { ToastController, NavController, MenuController } from '@ionic/angular'
import { UserService } from '@services/user'
import { SpinnerService } from '@services/spinner'
import { Store } from '@ngrx/store'
import { selectUser, selectCalendar } from '@selectors/app'
import { UnauthorizedError } from '@errors/unauthorized'
import { Role } from '@models/role'
import { TeamService } from '@services/team'

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
    concatLatestFrom(() => this.store.select(selectCalendar)),
    map(([action, calendar]) => AppActions.findUserTeam({ user: action.user.id, calendar: calendar.id, role: action.user.role })),
    catchError(error => of(AppActions.findUserTeamFailure({ error })))
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
    }),
    map(() => AppActions.logout())
  ))

  public logout$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.logout),
    tap(() => this.logoutNavigate()),
    map(() => AppActions.getCalendar())
  ))

  public findUserTeam$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.findUserTeam),
    switchMap(action => this.team.findUserTeam(action.calendar, action.user, action.role)),
    map(team => AppActions.setUserTeam({ team })),
    catchError(error => of(AppActions.findUserTeamFailure({ error })))
  ))

  public setUserTeam$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.setUserTeam),
    concatLatestFrom(() => this.store.select(selectUser)),
    tap(([_action, user]) => {
      this.spinner.stop()
      this.loginNavigate(user.role)
    })
  ), { dispatch: false })

  public findUserTeamFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AppActions.findUserTeamFailure),
    concatLatestFrom(() => this.store.select(selectUser)),
    tap(([_action, user]) => {
      this.spinner.stop()
      this.loginNavigate(user.role)
    })
  ), { dispatch: false })

  public constructor(
    private readonly actions$: Actions,
    private readonly calendars: CalendarService,
    private readonly user: UserService,
    private readonly nav: NavController,
    private readonly toast: ToastController,
    private readonly spinner: SpinnerService,
    private readonly store: Store,
    private readonly menu: MenuController,
    private readonly team: TeamService
  ) {}

  private async noCalendar(): Promise<void> {
    const role = (await firstValueFrom(this.store.select(selectUser))).role
    this.spinner.stop()
    if (role === 'admin') {
      this.nav.navigateForward(['/calendar'])
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
        this.nav.navigateForward(['/summary'], { replaceUrl: true })
        break
      case 'alumni':
        this.nav.navigateForward(['/team'], { replaceUrl: true })
        break
      default:
        break
    }
  }

  private async logoutNavigate(): Promise<void> {
    await this.menu.close()
    await this.nav.navigateRoot('/auth')
  }
}
