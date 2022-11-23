import { ChangeDetectionStrategy, Component, EnvironmentInjector } from '@angular/core'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { Platform } from '@ionic/angular'
import { Store } from '@ngrx/store'
import { Observable, BehaviorSubject, zip, map, firstValueFrom, filter } from 'rxjs'
import { SpinnerService } from '@services/spinner'
import { AuthService } from '@services/auth'
import { selectCalendar, selectUser } from '@selectors/app'
import { AppActions } from '@store/app'
import { Calendar } from '@models/calendar'
import { AppUser } from '@models/user'
import { ScannerService } from '@services/scanner'
@Component({
  selector: 'eva-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public readonly coordinatorPages = [
    { title: 'Proyectos', url: '/assessment', icon: 'checkbox' }
  ]

  public readonly appPages = {
    admin: [
      { title: 'Estadísticas', url: '/summary', icon: 'podium' },
      ...this.coordinatorPages,
      { title: 'Calificaciones', url: '/grades', icon: 'newspaper' },
      { title: 'Carreras', url: '/careers', icon: 'shapes' },
      { title: 'Directorio', url: '/directory', icon: 'business' },
      { title: 'Ciclo Escolar', url: '/calendar', icon: 'calendar' }
    ],
    coordinator: [
      ...this.coordinatorPages,
      { title: 'Rubricas', url: '/rubrics', icon: 'calculator' }
    ]
  }

  public initialized$: Observable<boolean>
  public spinning$: Observable<boolean>
  public user$: Observable<AppUser>
  public calendar$: Observable<Calendar>
  public menu$: Observable<boolean>
  public scanning$: Observable<boolean>
  private initialized: BehaviorSubject<boolean>
  public constructor(
    public readonly injector: EnvironmentInjector,
    private readonly platform: Platform,
    private readonly spinner: SpinnerService,
    private readonly store: Store,
    private readonly auth: AuthService,
    private readonly scanner: ScannerService
  ) {
    this.scanning$ = this.scanner.scanning$
    this.spinning$ = this.spinner.spinning$
    this.initialized = new BehaviorSubject(false)
    this.initialized$ = this.initialized.asObservable()
    this.user$ = this.store.select(selectUser)
    this.calendar$ = this.store.select(selectCalendar)
    this.menu$ = zip(this.user$, this.calendar$).pipe(
      map(([user, calendar]) => !user && !calendar)
    )
    this.init()
  }

  public async signOut(): Promise<void> {
    await this.auth.signOut()
    this.store.dispatch(AppActions.logout())
  }

  public stopScanning(): void {
    this.scanner.stopScanning()
  }

  private async init(): Promise<void> {
    await this.platform.ready()
    if (this.platform.is('ios') && this.platform.is('hybrid')) await this.showSplash()
    this.initialized.next(true)
    GoogleAuth.initialize({
      clientId: '733249240859-k9viv6v3lagtbqn68uk0a4mnk52ng5h5.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true
    })
    this.store.dispatch(AppActions.getCalendar())
    const user = await firstValueFrom(this.auth.state$)
    const calendar = await firstValueFrom(this.calendar$.pipe(filter(c => !!c)))
    if (user) this.store.dispatch(AppActions.autoLogin({ user, calendar: calendar.id }))
  }

  private async showSplash(): Promise<void> {
    const lottie = (window as any).lottie
    await lottie.splashscreen.hide()
    await lottie.splashscreen.show('public/assets/eva.json', false)
  }
}
