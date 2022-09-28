import { Component, ChangeDetectionStrategy, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { LottieComponent } from './lottie.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'eva-spinner',
  imports: [LottieComponent, CommonModule],
  template: `
    <div class="spinner-container" [ngClass]="{ 'spinner-container-fullscreen': fullscreen }">
      <eva-lottie [style.width]="width" src="/assets/spinner.json"></eva-lottie>
    </div>
  `,
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  @Input() width = '30%'
  @Input() fullscreen = false
  constructor() {}
}
