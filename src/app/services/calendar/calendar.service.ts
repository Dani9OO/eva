import { Injectable } from '@angular/core'
import { Calendar } from '@models/calendar'
import { Firestore, setDoc, doc, DocumentReference, getDoc } from '@angular/fire/firestore'
import { DataService } from '@classes/data-service'
import { switchMap, tap, take } from 'rxjs/operators'
import { map, from, Observable } from 'rxjs'
import { UnexpectedError } from '@errors/unexpected'

@Injectable({
  providedIn: 'root'
})
export class CalendarService extends DataService<Calendar> {
  public constructor(
    protected readonly firestore: Firestore
  ) {
    super('Calendar', firestore)
  }

  public getCurrentCalendar(): Observable<Calendar> {
    const ref = doc(this.firestore, 'calendar', 'current') as DocumentReference<{ id: string }>
    return from(getDoc(ref)).pipe(
      take(1),
      tap(result => { if (!result.exists()) throw new UnexpectedError('retrieving current calendar') }),
      switchMap(calendar => from(getDoc(this.doc(this.path, calendar.data().id))).pipe(
        take(1),
        map(result => ({ id: result.id, ...result.data() }))
      ))
    )
  }

  public upsertCalendar(start: string, end: string, id?: string): Observable<Calendar> {
    const dates: [Date, Date] = [new Date(start), new Date(end)]
    const entity: Calendar = {
      dates: [start, end],
      title: `${dates.map(date => this.getMonth(date).slice(0, 3)).join('-')}${dates[1].getFullYear()}`
    }
    if (id) entity.id = id
    return this.upsert(entity)
  }

  public getAllCalendars(): Observable<Calendar[]> {
    return this.getCurrentCalendar().pipe(
      switchMap(current => this.getAll().pipe(
        map(calendars => {
          const index = calendars.findIndex(calendar => calendar.id === current.id)
          if (index === -1) return calendars
          calendars.splice(index, 1, { ...calendars[index], active: true })
          return calendars
        })
      ))
    )
  }

  public selectCurrentCalendar(calendar: Calendar): Observable<{ id: string }> {
    return from(setDoc(doc(this.firestore, 'calendar', 'current'), { id: calendar.id }, { merge: true })).pipe(
      map(() => ({ id: calendar.id }))
    )
  }

  private getMonth(date: Date): string {
    return new Intl.DateTimeFormat('es-MX', { month: 'short' }).format(date).toUpperCase()
  }
}
