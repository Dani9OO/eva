import { Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithCredential, signOut } from '@angular/fire/auth';
import { firstValueFrom, } from 'rxjs';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { SpinnerService } from '../spinner/spinner.service';
import { Store } from '@ngrx/store';
import * as AuthActions from 'src/app/app.actions'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private spinner: SpinnerService,
    private store: Store
  ) {}

  public async signIn() {
    const user = await GoogleAuth.signIn()
    const oauth = GoogleAuthProvider.credential(user.authentication.idToken, user.authentication.accessToken)
    const credential = await signInWithCredential(this.auth, oauth)
    return credential.user
  }

  public async signOut() {
    await signOut(this.auth)
  }
}
