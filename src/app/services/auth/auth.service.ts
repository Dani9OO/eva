import { Injectable } from '@angular/core'
import { Auth, authState, GoogleAuthProvider, signInWithCredential, signOut } from '@angular/fire/auth'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { User as FirebaseUser } from 'firebase/auth'
import { Observable, map } from 'rxjs'
import { traceUntilFirst } from '@angular/fire/performance'
import { SpinnerService } from '@services/spinner'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly state$: Observable<FirebaseUser>

  public constructor(
    private readonly auth: Auth,
    private readonly spinner: SpinnerService
  ) {
    this.state$ = authState(this.auth).pipe(
      traceUntilFirst('auth'),
      map(user => user ? user.toJSON() as FirebaseUser : undefined)
    )
  }

  public async signIn(): Promise<FirebaseUser> {
    this.spinner.spin()
    try {
      const user = await GoogleAuth.signIn()
      const oauth = GoogleAuthProvider.credential(user.authentication.idToken, user.authentication.accessToken)
      const credential = await signInWithCredential(this.auth, oauth)
      return credential.user.toJSON() as FirebaseUser
    } catch (error) {
      this.spinner.stop()
    }
  }

  public async signOut(): Promise<void> {
    await signOut(this.auth)
  }
}
