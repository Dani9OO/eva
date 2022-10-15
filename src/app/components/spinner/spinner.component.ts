import { Component, ChangeDetectionStrategy, Input } from '@angular/core'
import { LottieComponent } from '../lottie/lottie.component'
import { CommonModule } from '@angular/common'

@Component({
  standalone: true,
  selector: 'eva-spinner',
  imports: [LottieComponent, CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  @Input() public width = '30%'
  @Input() public fullscreen = false
  public constructor() {}
}
