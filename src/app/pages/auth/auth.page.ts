import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Observable } from 'rxjs'
import { User } from 'src/app/models/user.model'
import { Store } from '@ngrx/store'
import { selectUser } from '../../app.selectors'
import * as AuthActions from 'src/app/app.actions'

@Component({
  selector: 'eva-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPage {
  public user$: Observable<User>

  public constructor(
    private readonly store: Store
  ) {
    this.user$ = this.store.select(selectUser)
  }

  public signIn(): void {
    this.store.dispatch(AuthActions.login())
  }
}
