import { Injectable } from '@angular/core'
import { DataService } from '@classes/data-service'
import { Firestore, query, where, getDocs } from '@angular/fire/firestore'
import { Observable, from, map } from 'rxjs'
import { Rubric } from '@models/rubric'
import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RubricService extends DataService<Rubric> {
  public constructor(
    protected readonly firestore: Firestore
  ) {
    super('Rubric', firestore)
  }

  public getRubrics(calendar: string, career: string): Observable<Rubric[]> {
    const q = query(this.collection, where('calendar', '==', calendar), where('career', '==', career))
    return from(getDocs(q)).pipe(
      take(1),
      map(result => result.docs.map(document => ({ id: document.id, ...document.data() })))
    )
  }
}
