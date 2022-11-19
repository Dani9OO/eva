import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, ModalController } from '@ionic/angular'
import { Career } from '@models/career'
import { CareerItemComponent } from '@components/career-item/career-item.component'

@Component({
  selector: 'eva-career-selector',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    CareerItemComponent
  ],
  templateUrl: './career-selector.component.html',
  styleUrls: ['./career-selector.component.scss']
})
export class CareerSelectorComponent {
  @Input() public careers: Career[]
  @Input() public c: string

  public constructor(
    private modal: ModalController
  ) {}

  public onSelect(career: Career): void {
    this.modal.dismiss(career, 'confirm')
  }

  public cancel(): void {
    this.modal.dismiss(undefined, 'cancel')
  }
}
