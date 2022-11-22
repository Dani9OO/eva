import { Injectable } from '@angular/core'
import { DataService } from '@classes/data-service'
import { Firestore, query, where, getDocs } from '@angular/fire/firestore'
import { Observable, from, map } from 'rxjs'
import { Assessment } from '@models/assessment'
import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AssessmentService extends DataService<Assessment> {
  public constructor(
    protected readonly firestore: Firestore
  ) {
    super('Assessment', firestore)
  }

  public getAssessments(calendar: string, career?: string): Observable<Assessment[]> {
    const q = career
      ? query(this.collection, where('calendar', '==', calendar), where('career', '==', career))
      : query(this.collection, where('calendar', '==', calendar))
    return from(getDocs(q)).pipe(
      take(1),
      map(result => result.docs.map(document => ({ id: document.id, ...document.data() })))
    )
  }
}
