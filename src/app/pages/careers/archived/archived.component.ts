import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Career } from '@models/career'
import { selectInactiveCareers } from '@selectors/career'
import { ModalController } from '@ionic/angular'
import { CareerActions } from '@store/career'

@Component({
  selector: 'eva-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchivedComponent implements OnInit {
  public careers$: Observable<Career[]>

  public constructor(
    private readonly store: Store,
    private readonly modal: ModalController
  ) { }

  public ngOnInit(): void {
    this.careers$ = this.store.select(selectInactiveCareers)
  }

  public back(): void {
    this.modal.dismiss()
  }

  public unarchive(career: Career): void {
    this.store.dispatch(CareerActions.toggleArchived({ career }))
  }
}
