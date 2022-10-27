import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { AppUser } from '@models/user'

@Component({
  selector: 'eva-user-item',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent {
  @Input() public detail = false
  @Input() public user: AppUser

  public constructor() { }
}
