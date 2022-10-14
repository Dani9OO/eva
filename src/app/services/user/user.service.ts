import { Role } from './../../common/types/role.type'
import { Injectable } from '@angular/core'
import { User } from 'src/app/models/user.model'
import { DataService } from '../../common/classes/data-service.class'
import { Firestore, setDoc, doc, docData } from '@angular/fire/firestore'
import { User as FirebaseUser } from 'firebase/auth'
import { AppUser } from '../../models/user.model'
import { UnauthorizedError } from '../../common/errors/unauthorized.error'
import { zip, map, Observable, from } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService<User> {

  constructor(
    protected readonly firestore: Firestore
  ) {
    super('User', firestore)
  }

  public updateUserData(user: FirebaseUser) {
    const data = {
      id: user.uid,
      name: user.displayName,
      photo: user.photoURL,
      email: user.email
    }
    return from(setDoc(this.getUserRef(user.uid), data, { merge: true }))
  }

  public getUser(id: string) {
    return docData(this.getUserRef(id))
  }

  public getRoles(user: User): Observable<{ role: Role, permissions: string[]}> {
    return zip([
      docData(doc(this.firestore, 'roles', user.email.split('@')[1])),
      docData(doc(this.firestore, 'admins', user.email)),
      docData(doc(this.firestore, 'coordinators', user.email))
    ]).pipe(
      map(([domain, admin, coordinator]) => {
        if (admin) return {
          role: 'admin',
          permissions: ['*']
        }
        if (coordinator) return {
          role: 'coordinator',
          permissions: coordinator.permissions
        }
        if (domain) return {
          role: domain.role,
          permissions: []
        }
        throw new UnauthorizedError(user.email)
      })
    )
  }

  public getAppUser(id: string): Observable<AppUser> {
    return this.getUser(id).pipe(
      switchMap(user => this.getRoles(user).pipe(
        map(roles => ({ ...user, ...roles }))
      ))
    )
  }

  private getUserRef(id: string) {
    return this.doc(this.path, id)
  }

}
