import { Injectable } from '@angular/core'
import { DataService } from '@classes/data-service'
import { Group } from '@models/group'
import { Firestore, query, where, getDocs, orderBy } from '@angular/fire/firestore'
import { Observable, from, map } from 'rxjs'
import { switchMap, take } from 'rxjs/operators'
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
      take(1),
      switchMap(result => {
        const batch = writeBatch(this.firestore)
        result.docs.forEach(document => batch.delete(document.ref))
        return from(batch.commit())
      }),
      switchMap(() => this.upsertMany(groups))
    )
  }

  public getGroups(calendar: string, career?: string): Observable<Group[]> {
    const q = career
      ? query(
        this.collection,
        orderBy('quarter'),
        where('calendar', '==', calendar),
        where('career', '==', career)
      )
      : query(
        this.collection,
        orderBy('quarter'),
        where('calendar', '==', calendar)
      )
    return from(getDocs(q)).pipe(
      take(1),
      map(result => result.docs.map(document => ({ id: document.id, ...document.data() })))
    )
  }
}
