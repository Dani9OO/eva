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
          <ion-button fill="clear" size="small" color="medium" (click)="openMenu()" *ngIf="!desktop">
            <ion-icon slot="icon-only" name="menu-outline" size="large"></ion-icon>
          </ion-button>
          <ion-label>
            <h1>
              <ng-content></ng-content>
            </h1>
          </ion-label>
        </div>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [
    '.toolbar-content { display: grid; grid-template-columns: 3.4375rem 1fr 3.4375rem; gap: var(--padding-start); }',
    'ion-toolbar.md div.toolbar-content { padding-left: var(--padding-start); align-items: center; }',
    'h1 { margin: 0 !important }',
    'ion-button { margin: 0 }',
    'ion-label.ios > h1 { text-align: center; }'
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
