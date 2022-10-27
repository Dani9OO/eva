import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core'
import { Career } from '@models/career'
import { Store } from '@ngrx/store'
import { Observable, firstValueFrom } from 'rxjs'
import { selectLoading, selectActiveCareers, selectInactiveCareersCount } from '@selectors/career'
import { RefresherCustomEvent, ModalController, IonList, NavController } from '@ionic/angular'
import { CareerActions } from '@store/career'
import { UpsertCareerComponent } from './upsert-career/upsert-career.component'
import { ArchivedComponent } from './archived/archived.component'
import { selectCalendar } from '@store/app/app.selectors'
import { CoordinatorActions } from '@store/coordinator'

@Component({
  selector: 'eva-careers',
  templateUrl: './careers.page.html',
  styleUrls: ['./careers.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareersPage implements OnInit {
  @ViewChild('list') public list: IonList
  public careers$: Observable<Career[]>
  public loading$: Observable<boolean>
  public archived$: Observable<number>

  public constructor(
    private readonly store: Store,
    private readonly modal: ModalController,
    private readonly nav: NavController
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(CareerActions.loadCareers({}))
    this.careers$ = this.store.select(selectActiveCareers)
    this.archived$ = this.store.select(selectInactiveCareersCount)
    this.loading$ = this.store.select(selectLoading)
  }

  public refresh(event: Event): void {
    const ev = event as RefresherCustomEvent
    this.store.dispatch(CareerActions.loadCareers({ force: true }))
    ev.target.complete()
  }

  public archive(career: Career): void {
    this.list.closeSlidingItems()
    this.store.dispatch(CareerActions.toggleArchived({ career }))
  }

  public async upsertCareer(career?: Career): Promise<void> {
    this.list.closeSlidingItems()
    const modal = await this.modal.create({
      component: UpsertCareerComponent,
      componentProps: { career }
    })
    await modal.present()
    const data = await modal.onWillDismiss<Omit<Career, 'archived'>>()
    if (data.role !== 'confirm' || !data.data) return
    this.store.dispatch(CareerActions.upsertCareer({ career: { id: career?.id, ...data.data } }))
  }

  public async archived(): Promise<void> {
    const modal = await this.modal.create({
      component: ArchivedComponent
    })
    await modal.present()
  }

  public async detail(career: Career): Promise<void> {
    const calendar = await firstValueFrom(this.store.select(selectCalendar))
    this.store.dispatch(CoordinatorActions.loadCoordinators({ calendar: calendar.id, career: career.id }))
    this.nav.navigateForward(['careers', career.id])
  }
}
