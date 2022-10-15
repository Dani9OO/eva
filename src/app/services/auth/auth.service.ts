import { Injectable } from '@angular/core'
import { Auth, GoogleAuthProvider, signInWithCredential, signOut } from '@angular/fire/auth'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { User as FirebaseUser } from 'firebase/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public constructor(
    private auth: Auth
  ) {}

  public async signIn(): Promise<FirebaseUser> {
    const user = await GoogleAuth.signIn()
    const oauth = GoogleAuthProvider.credential(user.authentication.idToken, user.authentication.accessToken)
    const credential = await signInWithCredential(this.auth, oauth)
    return credential.user
  }

  public async signOut(): Promise<void> {
    await signOut(this.auth)
  }
}
