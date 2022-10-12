import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject, zip, map } from 'rxjs';
import { User } from './models/user.model';
import { AuthService } from './services/auth/auth.service';
import { SpinnerService } from './services/spinner/spinner.service';
import * as AppActions from './app.actions'
import { selectUser, selectCalendar } from './app.selectors';
import { Calendar } from './models/calendar.model';
@Component({
  selector: 'eva-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  public appPages = [
    { title: 'Estadísticas', url: '/summary', icon: 'podium' },
    { title: 'Carreras', url: '/degrees', icon: 'shapes' },
    { title: 'Rubricas', url: '/rubrics', icon: 'calculator' },
    { title: 'Directorio', url: '/directory', icon: 'business' },
    { title: 'Ciclo Escolar', url: '/calendar', icon: 'calendar' }
  ]
  public initialized$: Observable<boolean>
  public spinning$: Observable<boolean>
  public user$: Observable<User>
  public calendar$: Observable<Calendar>
  public menu$: Observable<boolean>
  private initialized: BehaviorSubject<boolean>
  constructor(
    private platform: Platform,
    private spinner: SpinnerService,
    private store: Store
  ) {
    this.spinning$ = this.spinner.spinning$
    this.initialized = new BehaviorSubject(false)
    this.initialized$ = this.initialized.asObservable()
    this.user$ = this.store.select(selectUser)
    this.calendar$ = this.store.select(selectCalendar)
    this.menu$ = zip(this.user$, this.calendar$).pipe(
      map(([user, calendar]) => !user && !calendar)
    );
    this.init()
  }

  public signOut() {
    this.store.dispatch(AppActions.logout())
  }

  private async init() {
    await this.platform.ready()
    if (this.platform.is('ios') && this.platform.is('hybrid')) await this.showSplash()
    this.initialized.next(true)
    GoogleAuth.initialize({
      clientId: '733249240859-k9viv6v3lagtbqn68uk0a4mnk52ng5h5.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    })
    this.store.dispatch(AppActions.autoLogin())
  }

  private async showSplash() {
    const lottie = (window as any).lottie
    await lottie.splashscreen.hide()
    await lottie.splashscreen.show('public/assets/eva.json', false)
  }
}
