import { Pipe, PipeTransform } from '@angular/core'
import { Shift } from '@models/group'

@Pipe({
  name: 'shift',
  standalone: true
})
export class ShiftPipe implements PipeTransform {
  public transform(shift: Shift): string {
    switch (shift) {
      case 'morning': return 'Matutino'
      case 'evening': return 'Vespertino'
      default: return ''
    }
  }
}
