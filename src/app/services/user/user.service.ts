import { Role } from './../../common/types/role.type';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DataService } from '../../common/classes/data-service.class';
import { Firestore, setDoc, getDoc, doc } from '@angular/fire/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { RoleDocument } from '../../models/role.model';
import { PermissionDocument } from '../../models/permission.model';
import { AppUser } from '../../models/user.model';
import { UnauthorizedError } from '../../common/errors/unauthorized.error';

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService<User> {

  constructor(
    protected readonly firestore: Firestore
  ) {
    super('User', firestore)
  }

  public async updateUserData(user: FirebaseUser) {
    const data = {
      uid: user.uid,
      name: user.displayName,
      photo: user.photoURL,
      email: user.email
    }
    await setDoc(this.getUserRef(user.uid), data, { merge: true })
  }

  public async getUser(id: string) {
    const doc = await getDoc(this.getUserRef(id))
    return doc.data()
  }

  public async getRoles(user: User): Promise<{ role: Role, permissions: string[]}> {
    const [domain, admin, coordinator] = await Promise.all([
      await getDoc(doc(this.firestore, 'roles', user.email.split('@')[1])),
      (await getDoc(doc(this.firestore, 'admins', user.email))).exists(),
      await getDoc(doc(this.firestore, 'coordinators', user.email))
    ])
    if (admin) return { role: 'admin', permissions: ['*'] }
    if (coordinator.exists()) return {
      role: 'coordinator',
      permissions: (coordinator.data() as PermissionDocument).permissions
    }
    if (domain.exists()) return { role: (domain.data() as RoleDocument).role, permissions: [] }
    throw new UnauthorizedError(user.email)
  }

  public async getAppUser(id: string): Promise<AppUser> {
    const user = await this.getUser(id)
    const { role, permissions } = await this.getRoles(user)
    return { ...user, role, permissions }
  }

  private getUserRef(id: string) {
    return this.doc(this.path, id)
  }

}
