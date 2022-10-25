import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'quarter',
  standalone: true
})
export class QuarterPipe implements PipeTransform {
  public transform(quarter: string): string {
    switch (quarter) {
      case '1': return 'Primero'
      case '2': return 'Segundo'
      case '3': return 'Tercero'
      case '4': return 'Cuarto'
      case '5': return 'Quinto'
      case '6': return 'Sexto'
      case '7': return 'Séptimo'
      case '8': return 'Octavo'
      case '9': return 'Noveno'
      case '10': return 'Décimo'
      default: return ''
    }
  }
}
