import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { User } from 'src/app/models/user.model'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { selectUser } from '../../app.selectors'
import * as AuthActions from 'src/app/app.actions'

@Component({
  selector: 'eva-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPage implements OnInit {

  public user$: Observable<User>

  constructor(
    private readonly store: Store,
    private router: Router
  ) {
    this.user$ = this.store.select(selectUser)
  }

  ngOnInit() {
  }

  async signIn() {
    this.store.dispatch(AuthActions.login())
  }

}
