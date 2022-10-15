import { Injectable } from '@angular/core'
import { User } from 'src/app/models/user.model'
import { DataService } from '../../common/classes/data-service.class'
import { Firestore, doc, docData, DocumentReference } from '@angular/fire/firestore'
import { User as FirebaseUser } from 'firebase/auth'
import { AppUser } from '../../models/user.model'
import { UnauthorizedError } from '../../common/errors/unauthorized.error'
import { zip, map, Observable } from 'rxjs'

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
      email: user.email
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

  private getUserRef(id: string): DocumentReference<User> {
    return this.doc(this.path, id)
  }
}
