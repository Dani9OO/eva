import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public spinning$: Observable<boolean>
  private spinning: BehaviorSubject<boolean>

  public constructor() {
    this.spinning = new BehaviorSubject(false)
    this.spinning$ = this.spinning.asObservable()
  }

  public spin(): void {
    this.spinning.next(true)
  }

  public stop(): void {
    this.spinning.next(false)
  }
}
