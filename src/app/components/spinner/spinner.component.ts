import { Component, ChangeDetectionStrategy, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { LottieComponent } from '../lottie/lottie.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'eva-spinner',
  imports: [LottieComponent, CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  @Input() width = '30%'
  @Input() fullscreen = false
  constructor() {}
}
