import { Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithCredential, signInWithPopup, signOut } from '@angular/fire/auth';
import { asyncScheduler, Observable, scheduled, } from 'rxjs';
import { User } from '../../models/user';
import { switchMap, tap } from 'rxjs/operators';
import { Firestore, doc, docData, DocumentReference, setDoc } from '@angular/fire/firestore';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<User>

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private platform: Platform,
    private router: Router
  ) {
    this.user$ = authState(this.auth).pipe(
      switchMap(user => user ? this.getUser(user.uid) : scheduled([undefined], asyncScheduler)),
      tap(user => {
        if (user) this.router.navigate(['/summary'], { replaceUrl: true })
      })
    )
  }

  public async signIn() {
    const credential = this.platform.is('hybrid')
      ? await signInWithCredential(this.auth, GoogleAuthProvider.credential((await GoogleAuth.signIn()).authentication.idToken))
      : await signInWithPopup(this.auth, new GoogleAuthProvider());
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
