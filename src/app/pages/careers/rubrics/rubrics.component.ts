import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'eva-rubrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rubrics.component.html',
  styleUrls: ['./rubrics.component.scss']
})
export class RubricsComponent {
  public constructor() { }
}
