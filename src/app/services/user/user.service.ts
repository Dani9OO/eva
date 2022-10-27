import { Injectable } from '@angular/core'
import { User, AppUser } from '@models/user'
import { DataService } from '@classes/data-service'
import {
  Firestore,
  doc,
  getDoc,
  DocumentReference,
  query,
  where,
  deleteDoc,
  collection,
  CollectionReference,
  getCountFromServer,
  getDocs,
  setDoc
} from '@angular/fire/firestore'
import { User as FirebaseUser } from 'firebase/auth'
import { UnauthorizedError } from '@errors/unauthorized'
import { zip, map, Observable, from, scheduled, asapScheduler } from 'rxjs'
import { switchMap, take } from 'rxjs/operators'
import { Update } from '@ngrx/entity'
import { RoleDocument } from '@models/role'
import { Coordinator } from '@models/coordinator'
import { orderBy } from 'firebase/firestore'

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService<User> {
  public constructor(
    protected readonly firestore: Firestore
  ) {
    super('User', firestore)
  }

  public updateUserData(user: FirebaseUser): Observable<User> {
    const entity = {
      id: user.uid,
      name: user.displayName,
      photo: user.photoURL,
      email: user.email,
      domain: user.email.split('@')[1]
    }
    return this.upsert(entity)
  }

  public getUser(id: string): Observable<User> {
    return from(getDoc(this.getUserRef(id))).pipe(take(1), map(result => ({ id: result.id, ...result.data() })))
  }

  public getRoles(user: User, calendar?: string): Observable<AppUser> {
    const ref = calendar ? collection(this.firestore, 'coordinators') as CollectionReference<Coordinator> : undefined
    const q = calendar ? query(ref, where('user', '==', user.id), where('calendar', '==', calendar)) : undefined
    return zip([
      from(getDoc(doc(this.firestore, 'roles', user.domain) as DocumentReference<RoleDocument>)).pipe(
        take(1), map(result => ({ ...result.data() }))
      ),
      from(getDoc(doc(this.firestore, 'admins', user.email))).pipe(take(1), map(result => result.exists())),
      calendar ? from(getCountFromServer(q)).pipe(take(1), map(result => result.data().count > 0)) : scheduled([false], asapScheduler)
    ]).pipe(
      map(([domain, admin, coordinator]) => {
        if (admin) return {
          ...user,
          role: 'admin'
        }
        if (coordinator) return {
          ...user,
          role: 'coordinator'
        }
        if (domain) return {
          ...user,
          role: domain.role
        }
        throw new UnauthorizedError(user.email)
      })
    )
  }

  public getAppUsers(calendar?: string): Observable<AppUser[]> {
    return from(getDocs(query(this.collection, orderBy('domain'), where('domain', '!=', 'soy.utj.edu.mx'), orderBy('name')))).pipe(
      take(1),
      switchMap(result => zip(result.docs.map(document => this.getRoles({ id: document.id, ...document.data() }, calendar))))
    )
  }

  public toggleAdmin(user: AppUser): Observable<Update<AppUser>> {
    const ref = doc(this.firestore, 'admins', user.email)
    return from(getDoc(ref)).pipe(
      switchMap(document => from(document.exists() ? deleteDoc(ref) : setDoc(ref, {}))),
      switchMap(() => this.getRoles(user)),
      map((u) => ({ id: u.id, changes: { role: u.role } }))
    )
  }

  private getUserRef(id: string): DocumentReference<User> {
    return this.doc(this.path, id)
  }
}
