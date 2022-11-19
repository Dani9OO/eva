import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Career } from '@models/career'
import { IonicModule } from '@ionic/angular'

@Component({
  selector: 'eva-career-item',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './career-item.component.html',
  styleUrls: ['./career-item.component.scss']
})
export class CareerItemComponent {
  @Input() public selected = false
  @Input() public color = 'primary'
  @Input() public detail = false
  @Input() public career: Career
}
