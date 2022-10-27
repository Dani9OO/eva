import { Injectable } from '@angular/core'
import { Firestore, getDocs, orderBy, query, updateDoc } from '@angular/fire/firestore'
import { DataService } from '@classes/data-service'
import { Observable, from, map } from 'rxjs'
import { Career } from '@models/career'
import { Update } from '@ngrx/entity'
import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CareerService extends DataService<Career> {
  public constructor(
    protected readonly firestore: Firestore
  ) {
    super('Career', firestore)
  }

  public upsertCareer(career: Omit<Career, 'archived'>): Observable<Career> {
    const entity: Career = { ...career, archived: false }
    return this.upsert(entity)
  }

  public toggleArchived(career: Career): Observable<Update<Career>> {
    const updated = { ...career, archived: !career.archived }
    const doc = this.doc(this.path, career.id)
    return from(updateDoc(doc, updated)).pipe(
      map(() => ({ id: updated.id, changes: { archived: updated.archived } }))
    )
  }

  public getAbbreviation(name: string): string {
    return name
      .split(' ')
      .filter(word => word && word.length > 2 && word !== 'área' && word !== 'area')
      .map(word => word[0].toUpperCase())
      .join('')
  }

  public getAllCareers(): Observable<Career[]> {
    const q = query(this.collection, orderBy('name'))
    return from(getDocs(q)).pipe(
      take(1),
      map(result => result.docs.map(document => ({ id: document.id, ...document.data() })))
    )
  }
}
