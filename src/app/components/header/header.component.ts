import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, MenuController } from '@ionic/angular'

@Component({
  standalone: true,
  selector: 'eva-header',
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  public desktop: boolean
  public constructor(
    private menu: MenuController
  ) {}

  public async openMenu(): Promise<void> {
    await this.menu.open('main-menu')
  }
}
