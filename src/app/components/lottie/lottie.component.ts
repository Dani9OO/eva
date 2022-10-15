import { Component, ChangeDetectionStrategy, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'
import { AppService } from '../../services/app/app.service'

@Component({
  standalone: true,
  selector: 'eva-lottie',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lottie.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LottieComponent implements OnInit {
  @Input() public autoplay = true
  @Input() public loop = true
  @Input() public mode = 'normal'
  @Input() public src: string
  @Input() public width = 'auto'
  @Input() public height = 'auto'
  public constructor(private app: AppService) {}
  public ngOnInit(): void { this.app.initLottie() }
}
