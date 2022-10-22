import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { CareerEffects } from './career.effects'

describe('CalendarEffects', () => {
  let actions$: Observable<any>
  let effects: CareerEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CareerEffects,
        provideMockActions(() => actions$)
      ]
    })

    effects = TestBed.inject(CareerEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()
  })
})
