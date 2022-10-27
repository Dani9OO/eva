import { Injectable } from '@angular/core'
import { DataService } from '@classes/data-service'
import { Firestore, query, where, deleteDoc, getDocs } from '@angular/fire/firestore'
import { from, Observable, zip, map } from 'rxjs'
import { Coordinator } from '@models/coordinator'
import { switchMap, take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService extends DataService<Coordinator> {
  public constructor(
    protected readonly firestore: Firestore
  ) {
    super('Coordinator', firestore)
  }

  public getCoordinators(calendar: string, career: string): Observable<Coordinator[]> {
    const q = query(this.collection, where('calendar', '==', calendar), where('career', '==', career))
    return from(getDocs(q)).pipe(
      take(1),
      map(result => result.docs.map(document => ({ id: document.id, ...document.data() })))
    )
  }

  public upsertCoordinator(coordinator: Coordinator): Observable<Coordinator> {
    const q = query(
      this.collection,
      where('calendar', '==', coordinator.calendar),
      where('career', '==', coordinator.career)
    )
    return from(getDocs(q)).pipe(
      take(1),
      switchMap(result => result.docs.length > 0
        ? zip(result.docs.map(document => from(deleteDoc(this.doc(this.path, document.id))))).pipe(
          switchMap(() => this.upsert(coordinator))
        )
        : this.upsert(coordinator))
    )
  }
}
