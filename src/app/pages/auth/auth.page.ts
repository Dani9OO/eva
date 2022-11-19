import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectIsSignedIn } from '@selectors/app'
import { AppActions } from '@store/app'
import { AuthService } from '@services/auth'

@Component({
  selector: 'eva-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPage {
  public user$: Observable<boolean>

  public constructor(
    private readonly store: Store,
    private readonly auth: AuthService
  ) {
    this.user$ = this.store.select(selectIsSignedIn)
  }

  public async signIn(): Promise<void> {
    try {
      const user = await this.auth.signIn()
      this.store.dispatch(AppActions.login({ user }))
    } catch (error) {
      this.store.dispatch(AppActions.loginFailure({ error }))
    }
  }

  public async signOut(): Promise<void> {
    await this.auth.signOut()
    this.store.dispatch(AppActions.logout())
  }
}
