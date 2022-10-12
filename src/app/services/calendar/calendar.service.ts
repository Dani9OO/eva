import { Injectable } from '@angular/core';
import { Calendar } from '../../models/calendar.model';
import { Firestore, getDoc } from '@angular/fire/firestore';
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

}
