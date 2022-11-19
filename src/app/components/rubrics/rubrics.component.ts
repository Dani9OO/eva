import { UpsertRubricComponent } from '../upsert-rubric/upsert-rubric.component'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, ModalController, RefresherCustomEvent } from '@ionic/angular'
import { Career } from '@models/career'
import { Calendar } from '@models/calendar'
import { Rubric } from '@models/rubric'
import { Store } from '@ngrx/store'
import { Observable, map, switchMap, zip } from 'rxjs'
import { selectRubrics, selectLoading } from '@selectors/rubric'
import { RubricActions } from '@store/rubric'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { RubricStoreModule } from '@store/rubric/rubric-store.module'
import { CareerItemComponent } from '@components/career-item/career-item.component'
import { Router } from '@angular/router'
import { selectCalendar } from '@selectors/app'
import { selectCareerById } from '@selectors/career'
import { HeaderComponent } from '../header/header.component'

@Component({
  selector: 'eva-rubrics',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ScrollingModule,
    SpinnerComponent,
    RubricStoreModule,
    UpsertRubricComponent,
    CareerItemComponent,
    HeaderComponent
  ],
  templateUrl: './rubrics.component.html',
  styleUrls: ['./rubrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RubricsComponent implements OnInit {
  public career$: Observable<Career>
  public calendar$: Observable<Calendar>
  public categories$: Observable<string[]>
  public rubrics$: Observable<{ [k: string]: Rubric[] }>
  public loading$: Observable<boolean>

  public constructor(
    private readonly modal: ModalController,
    private readonly store: Store,
    private readonly router: Router
  ) { }

  public ngOnInit(): void {
    this.calendar$ = this.store.select(selectCalendar)
    this.career$ = this.store.select(selectCareerById(this.router.url.split('/')[2]))
    this.loading$ = this.store.select(selectLoading)
    this.rubrics$ = zip(this.calendar$, this.career$).pipe(
      switchMap(([calendar, career]) => this.store.select(selectRubrics(calendar.id, career.id)))
    )
    this.categories$ = this.rubrics$.pipe(map(rubrics => rubrics ? Object.keys(rubrics) : []))
  }

  public refresh(event: Event, calendar: Calendar, career: Career): void {
    const ev = event as RefresherCustomEvent
    this.store.dispatch(RubricActions.loadRubrics({ calendar: calendar.id, career: career.id }))
    ev.target.complete()
  }

  public async upsertRubric(calendar: Calendar, career: Career, rubric?: Rubric): Promise<void> {
    const modal = await this.modal.create({
      component: UpsertRubricComponent,
      componentProps: {
        calendar,
        career,
        rubric
      }
    })
    await modal.present()
  }

  public remove(rubric: Rubric): void {
    this.store.dispatch(RubricActions.deleteRubric({ rubric }))
  }
}
