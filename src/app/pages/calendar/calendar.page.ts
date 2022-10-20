import { Component, OnInit } from '@angular/core'
import { ModalController, RefresherCustomEvent } from '@ionic/angular'
import { DateRangeComponent } from '@components/date-range/date-range.component'
import { Store } from '@ngrx/store'
import { Calendar } from '@models/calendar'
import { Observable } from 'rxjs'
import { CalendarActions } from '@store/calendar'
import { selectAllCalendars } from '@selectors/calendar'

@Component({
  selector: 'eva-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss']
})
export class CalendarPage implements OnInit {
  public calendars$: Observable<Calendar[]>

  public constructor(
    private readonly modal: ModalController,
    private readonly store: Store
  ) {

  }

  public ngOnInit(): void {
    this.store.dispatch(CalendarActions.loadCalendars({}))
    this.calendars$ = this.store.select(selectAllCalendars)
  }

  public refresh(event: Event): void {
    const ev = event as RefresherCustomEvent
    this.store.dispatch(CalendarActions.loadCalendars({}))
    ev.target.complete()
  }

  public async upsertCalendar(calendar?: Calendar): Promise<void> {
    const modal = await this.modal.create({
      component: DateRangeComponent,
      componentProps: {
        dates: calendar ? calendar.dates : []
      }
    })
    await modal.present()
    const result = await modal.onWillDismiss()
    if (!result.data) return
    const [start, end] = (result.data as [string, string])
    this.store.dispatch(CalendarActions.upsertCalendar({ start, end, id: calendar?.id }))
  }

  public selectCalendar(calendar: Calendar): void {
    this.store.dispatch(CalendarActions.selectCurrentCalendar({ calendar }))
  }
}
