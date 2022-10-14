import { Injectable } from '@angular/core'
import { Calendar } from '../../models/calendar.model'
import { Firestore, setDoc, docData, doc, DocumentReference } from '@angular/fire/firestore'
import { DataService } from '../../common/classes/data-service.class'
import { switchMap, tap } from 'rxjs/operators'
import { map, from } from 'rxjs'
import { UnexpectedError } from '../../common/errors/unexpected.error'

@Injectable({
  providedIn: 'root'
})
export class CalendarService extends DataService<Calendar> {

  constructor(
    protected readonly firestore: Firestore
  ) {
    super('Calendar', firestore)
  }

  public getCurrentCalendar() {
    return docData(doc(this.firestore, 'calendar', 'current') as DocumentReference<{ id: string }>).pipe(
      tap(calendar => { if(!calendar) throw new UnexpectedError('retrieving current calendar') }),
      map(calendar => calendar.id)
    )
  }

  public upsertCalendar(start: string, end: string, id?: string) {
    const dates: [Date, Date] = [new Date(start), new Date(end)]
    const entity: Calendar = {
      dates: [start, end],
      title: `${dates.map(date => this.getMonth(date).slice(0, 3)).join('-')}${dates[1].getFullYear()}`
    }
    if (id) entity.id = id
    return this.upsert(entity)
  }

  public getAllCalendars() {
    return this.getCurrentCalendar().pipe(
      switchMap(current => this.getAll().pipe(
        map(calendars => {
          const index = calendars.findIndex(calendar => calendar.id === current)
          if (index === -1) return calendars
          calendars.splice(index, 1, { ...calendars[index], active: true })
          return calendars
        })
      ))
    )
  }

  public selectCurrentCalendar(calendar: Calendar) {
    return from(setDoc(doc(this.firestore, 'calendar', 'current'), { id: calendar.id }, { merge: true })).pipe(
      map(() => ({ id: calendar.id }))
    )
  }

  private getMonth(date: Date) {
    return new Intl.DateTimeFormat('es-MX', { month: 'short' }).format(date).toUpperCase()
  }

}
