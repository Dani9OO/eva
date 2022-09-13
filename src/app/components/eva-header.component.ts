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
          <div class="center">
            <ion-button fill="clear" size="small" color="medium" (click)="openMenu()" *ngIf="!desktop">
              <ion-icon slot="icon-only" name="menu" size="large"></ion-icon>
            </ion-button>
          </div>
          <ion-label>
            <h1>
              <ng-content></ng-content>
            </h1>
          </ion-label>
          <ion-img src="assets/eva.svg"></ion-img>
        </div>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [
    'ion-img.ios { height: 28px; }',
    'ion-img.md { height: 40px; }',
    '.toolbar-content { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; }',
    'ion-toolbar.md div.toolbar-content { padding-left: 1rem; align-items: center; }',
    'h1 { margin: 0 !important }',
    '.center { display: flex; justify-content: center }',
    'ion-button { margin: 0 }'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaHeaderComponent {
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
