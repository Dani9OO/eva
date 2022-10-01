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
  template: `
    <ion-header>
      <ion-toolbar>
        <div class="toolbar-content">
          <div>
            <ion-button fill="clear" size="small" color="medium" (click)="openMenu()" *ngIf="!desktop">
              <ion-icon slot="icon-only" name="menu-outline" size="large"></ion-icon>
            </ion-button>
          </div>
          <ion-title>
            <ng-content></ng-content>
          </ion-title>
        </div>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [
    '.toolbar-content { display: grid; grid-template-columns: 3.4375rem 1fr 3.4375rem; gap: var(--padding-start); }',
    'ion-toolbar.md div.toolbar-content { padding-left: var(--padding-start); align-items: center; }',
    'ion-button { margin: 0 }',
  ],
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
