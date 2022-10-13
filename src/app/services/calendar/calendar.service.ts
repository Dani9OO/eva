import { Injectable } from '@angular/core';
import { Calendar } from '../../models/calendar.model';
import { Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { DataService } from '../../common/classes/data-service.class';

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
    const ref = this.doc('calendar', 'current')
    return this.fromDocument(getDoc<Calendar>(ref))
  }

  public async upsertCalendar(start: string, end: string, active: boolean = false, id?: string) {
    const dates: [Date, Date] = [new Date(start), new Date(end)]
    const entity: Calendar = {
      dates: [start, end],
      active,
      title: `${dates.map(date => this.getMonth(date).slice(0, 3)).join('-')}${dates[1].getFullYear()}`
    }
    if (id) entity.id = id
    return await this.upsert(entity)
  }

  private getMonth(date: Date) {
    return new Intl.DateTimeFormat('es-MX', { month: 'short' }).format(date).toUpperCase()
  }

}
