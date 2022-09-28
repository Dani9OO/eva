import { Component, ChangeDetectionStrategy, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { AppService } from '../services/app/app.service';

@Component({
  standalone: true,
  selector: 'eva-lottie',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <lottie-player
      [attr.autoplay]="autoplay"
      [attr.loop]="loop"
      [attr.mode]="mode"
      [attr.src]="src"
      [style.height]="height"
      [style.width]="width"
    >
    </lottie-player>
  `,
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
