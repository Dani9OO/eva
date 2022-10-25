import { Injectable } from '@angular/core'
import { DataService } from '@classes/data-service'
import { Group } from '@models/group'
import { Firestore, getDocs, query, where, collectionData } from '@angular/fire/firestore'
import { Observable, from } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { writeBatch } from 'firebase/firestore'

@Injectable({
  providedIn: 'root'
})
export class GroupService extends DataService<Group> {
  public constructor(
    protected readonly firestore: Firestore
  ) {
    super('Group', firestore)
  }

  public upsertGroups(calendar: string, career: string, groups: Group[]): Observable<Group[]> {
    const q = query(this.collection, where('calendar', '==', calendar), where('career', '==', career))
    return from(getDocs(q)).pipe(
      switchMap(result => {
        const batch = writeBatch(this.firestore)
        result.docs.forEach(document => batch.delete(document.ref))
        return from(batch.commit())
      }),
      switchMap(() => this.upsertMany(groups))
    )
  }

  public getGroups(calendar: string, career: string): Observable<Group[]> {
    return collectionData(query(this.collection, where('calendar', '==', calendar), where('career', '==', career)), { idField: 'id' })
  }
}
