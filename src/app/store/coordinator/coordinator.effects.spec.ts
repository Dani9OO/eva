import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { CoordinatorEffects } from './coordinator.effects'

describe('CalendarEffects', () => {
  let actions$: Observable<any>
  let effects: CoordinatorEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoordinatorEffects,
        provideMockActions(() => actions$)
      ]
    })

    effects = TestBed.inject(CoordinatorEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()
  })
})
