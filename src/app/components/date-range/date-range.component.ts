import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DatetimeCustomEvent, IonicModule, ModalController } from '@ionic/angular'
import { AppService } from '../../services/app/app.service'
import { trigger, transition, style, animate } from '@angular/animations'

@Component({
  standalone: true,
  selector: 'eva-date-range',
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'slideAnimation',
      [
        transition(
          ':enter',
          [
            style({ transform: 'translateX(200%)' }),
            animate('200ms 100ms ease-in', style({ transform: 'translateX(0%)' }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ transform: 'translateX(0%)' }),
            animate('200ms ease-out', style({ transform: 'translateX(-200%)' }))
          ]
        )
      ]
    )
  ]
})
export class DateRangeComponent {

  public page = 0
  public dates: [string?, string?] = []
  private _locale: string

  constructor(
    private app: AppService,
    private modal: ModalController
  ) {
    this._locale = this.app.locale
  }

  public get locale(): string {
    return this._locale
  }

  public selectDate(event: Event): void {
    this.dates[this.page] = ((event as DatetimeCustomEvent).detail.value as string)
  }

  public cancel(): void {
    if (this.page === 1) --this.page
    else this.modal.dismiss(undefined, 'cancel')
  }

  public confirm(): void {
    if (this.page === 0) ++this.page
    else this.modal.dismiss(this.dates, 'confirm')
  }
}
