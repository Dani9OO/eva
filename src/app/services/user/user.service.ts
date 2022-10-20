import { Injectable } from '@angular/core'
import { User } from '@models/user'
import { DataService } from '../../common/classes/data-service'
import { Firestore, doc, docData, DocumentReference, query, where, collectionData, deleteDoc, setDoc } from '@angular/fire/firestore'
import { User as FirebaseUser } from 'firebase/auth'
import { AppUser } from '../../models/user'
import { UnauthorizedError } from '../../common/errors/unauthorized'
import { zip, map, Observable, from } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { Update } from '@ngrx/entity'

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
    return docData(this.getUserRef(id))
  }

  public getRoles(user: User): Observable<AppUser> {
    return zip([
      docData(doc(this.firestore, 'roles', user.email.split('@')[1])),
      docData(doc(this.firestore, 'admins', user.email)),
      docData(doc(this.firestore, 'coordinators', user.email))
    ]).pipe(
      map(([domain, admin, coordinator]) => {
        if (admin) return {
          ...user,
          role: 'admin',
          permissions: ['*']
        }
        if (coordinator) return {
          ...user,
          role: 'coordinator',
          permissions: coordinator.permissions
        }
        if (domain) return {
          ...user,
          role: domain.role,
          permissions: []
        }
        throw new UnauthorizedError(user.email)
      })
    )
  }

  public getAppUsers(): Observable<AppUser[]> {
    return collectionData(query(this.collection, where('domain', '!=', 'soy.utj.edu.mx'))).pipe(
      switchMap(users => zip(users.map(u => this.getRoles(u))))
    )
  }

  public toggleAdmin(user: AppUser): Observable<Update<AppUser>> {
    const document = doc(this.firestore, 'admins', user.email)
    if (user.role === 'admin') {
      return from(deleteDoc(document)).pipe(
        switchMap(() => this.getRoles(user)),
        map((u) => ({ id: u.id, changes: { role: u.role, permissions: u.permissions } }))
      )
    } else {
      return from(setDoc(document, {})).pipe(
        switchMap(() => this.getRoles(user)),
        map((u) => ({ id: u.id, changes: { role: u.role, permissions: u.permissions } }))
      )
    }
  }

  private getUserRef(id: string): DocumentReference<User> {
    return this.doc(this.path, id)
  }
}
