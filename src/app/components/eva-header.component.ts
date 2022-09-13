import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

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
          <ion-img src="assets/eva.svg"></ion-img>
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
    'ion-img.ios { height: 28px; }',
    'ion-img.md { height: 40px; }',
    '.toolbar-content { display: flex; gap: 1rem; }',
    'ion-toolbar.ios div.toolbar-content { justify-content: center; }',
    'ion-toolbar.md div.toolbar-content { padding-left: 1rem; align-items: center; }',
    'h1 { margin: 0 !important }'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaHeaderComponent {}
