import { Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithCredential, signOut } from '@angular/fire/auth';
import { asyncScheduler, Observable, scheduled, } from 'rxjs';
import { User } from '../../models/user.model';
import { switchMap, tap } from 'rxjs/operators';
import { Firestore, doc, docData, DocumentReference, setDoc } from '@angular/fire/firestore';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<User>

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private spinner: SpinnerService
  ) {
    this.user$ = authState(this.auth).pipe(
      switchMap(user => user ? this.getUser(user.uid) : scheduled([undefined], asyncScheduler)),
      tap(() => this.spinner.stop())
    )
  }

  public async signIn() {
    const user = await GoogleAuth.signIn()
    const oauth = GoogleAuthProvider.credential(user.authentication.idToken, user.authentication.accessToken)
    const credential = await signInWithCredential(this.auth, oauth)
    this.updateUserData({
      uid: credential.user.uid,
      name: credential.user.displayName,
      photo: credential.user.photoURL,
      email: credential.user.email
    })
  }

  public async signOut() {
    await signOut(this.auth)
    this.router.navigate(['/auth'], { replaceUrl: true })
  }

  private getUser(id: string) {
    return docData(this.getUserRef(id))
  }

  private getUserRef(id: string) {
    return doc(this.firestore, `users/${id}`) as DocumentReference<User>
  }

  private async updateUserData(user: Partial<User>) {
    await setDoc(this.getUserRef(user.uid), user, { merge: true })
  }
}
