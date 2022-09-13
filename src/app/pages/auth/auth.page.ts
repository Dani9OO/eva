import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'eva-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPage implements OnInit {

  public user$: Observable<User>

  constructor(
    private auth: AuthService
  ) {
    this.user$ = auth.user$
  }

  ngOnInit() {
  }

  signIn() {
    this.auth.signIn()
  }

}
