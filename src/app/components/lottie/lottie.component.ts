import { Component, ChangeDetectionStrategy, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { AppService } from '../../services/app/app.service';

@Component({
  standalone: true,
  selector: 'eva-lottie',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lottie.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LottieComponent implements OnInit {
  @Input() autoplay = true
  @Input() loop = true
  @Input() mode = 'normal'
  @Input() src: string
  @Input() width = 'auto'
  @Input() height = 'auto'
  constructor(private app: AppService) {}
  ngOnInit(): void { this.app.initLottie() }
}
