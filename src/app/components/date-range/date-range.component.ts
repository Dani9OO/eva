import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DatetimeCustomEvent, IonicModule, ModalController } from '@ionic/angular'
import { AppService } from '@services/app'

@Component({
  standalone: true,
  selector: 'eva-date-range',
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeComponent implements OnInit {
  @Input() public dates: [string?, string?] = []
  private _locale: string

  public constructor(
    private app: AppService,
    private modal: ModalController
  ) {
    this._locale = this.app.locale
  }

  public get locale(): string {
    return this._locale
  }

  public ngOnInit(): void {
    this.dates = [...this.dates]
  }

  public selectDate(event: Event, index: number): void {
    this.dates[index] = ((event as DatetimeCustomEvent).detail.value as string)
  }

  public cancel(): void {
    this.modal.dismiss(undefined, 'cancel')
  }

  public confirm(): void {
    this.modal.dismiss(this.dates, 'confirm')
  }
}
