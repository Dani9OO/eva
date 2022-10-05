import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, MenuController, Platform } from '@ionic/angular';

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
  constructor(
    private menu: MenuController,
    private platform: Platform
  ) {
    this.desktop = this.platform.is('desktop')
  }
 public async openMenu(): Promise<void> {
  await this.menu.open('main-menu')
 }
}
