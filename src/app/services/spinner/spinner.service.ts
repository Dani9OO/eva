import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public spinning$: Observable<boolean>
  private spinning: BehaviorSubject<boolean>

  constructor() {
    this.spinning = new BehaviorSubject(false)
    this.spinning$ = this.spinning.asObservable()
  }

  public async spin(): Promise<void> {
    this.spinning.next(true)
  }

  public async stop(): Promise<void> {
    this.spinning.next(false)
  }
}
