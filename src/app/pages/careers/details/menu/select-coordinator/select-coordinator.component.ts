import { selectAllUsers } from '@selectors/user'
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, ModalController } from '@ionic/angular'
import { UserItemComponent } from '@components/user-item/user-item.component'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { AppUser } from '@models/user'
import { Career } from '@models/career'
import { Calendar } from '@models/calendar'
import { CareerItemComponent } from '@components/career-item/career-item.component'
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { CoordinatorActions } from '@store/coordinator'
import { CoordinatorStoreModule } from '@store/coordinator/coordinator-store.module'

@Component({
  selector: 'eva-select-coordinator',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    UserItemComponent,
    CareerItemComponent,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    CoordinatorStoreModule
  ],
  templateUrl: './select-coordinator.component.html',
  styleUrls: ['./select-coordinator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCoordinatorComponent implements OnInit {
  @Input() public readonly career: Career
  @Input() public readonly calendar: Calendar
  public users$: Observable<AppUser[]>
  public form: FormControl<string>

  public constructor(
    private readonly store: Store,
    private readonly modal: ModalController,
    private readonly fb: FormBuilder
  ) {}

  public get coordinator(): string { return this.form.value }
  @Input() public set coordinator(value) {
    this.form = this.fb.control(value || '')
  }

  public ngOnInit(): void {
    this.users$ = this.store.select(selectAllUsers)
  }

  public back(): void {
    this.modal.dismiss(undefined, 'cancel')
  }

  public save(): void {
    this.store.dispatch(CoordinatorActions.upsertCoordinator({
      coordinator: {
        calendar: this.calendar.id,
        career: this.career.id,
        user: this.form.value
      }
    }))
    this.modal.dismiss(undefined, 'confirm')
  }
}
