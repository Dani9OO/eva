import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Career } from '@models/career'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { selectLoading, selectActiveCareers, selectInactiveCareersCount } from '@selectors/career'
import { RefresherCustomEvent, ModalController } from '@ionic/angular'
import { CareerActions } from '@store/career'
import { UpsertCareerComponent } from './upsert-career/upsert-career.component'

@Component({
  selector: 'eva-careers',
  templateUrl: './careers.page.html',
  styleUrls: ['./careers.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareersPage implements OnInit {
  public careers$: Observable<Career[]>
  public loading$: Observable<boolean>
  public inactives$: Observable<number>

  public constructor(
    private readonly store: Store,
    private readonly modal: ModalController
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(CareerActions.loadCareers({}))
    this.careers$ = this.store.select(selectActiveCareers)
    this.inactives$ = this.store.select(selectInactiveCareersCount)
    this.loading$ = this.store.select(selectLoading)
  }

  public refresh(event: Event): void {
    const ev = event as RefresherCustomEvent
    this.store.dispatch(CareerActions.loadCareers({ force: true }))
    ev.target.complete()
  }

  public archive(career: Career): void {
    this.store.dispatch(CareerActions.toggleArchived({ career }))
  }

  public async upsertCareer(career?: Career): Promise<void> {
    const modal = await this.modal.create({
      component: UpsertCareerComponent,
      componentProps: { career }
    })
    await modal.present()
    const data = await modal.onWillDismiss<Omit<Career, 'archived'>>()
    if (data.role !== 'confirm' || !data.data) return
    this.store.dispatch(CareerActions.upsertCareer({ career: data.data }))
  }
}
