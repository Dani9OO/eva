import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { RubricEffects } from './rubric.effects'

describe('CalendarEffects', () => {
  let actions$: Observable<any>
  let effects: RubricEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RubricEffects,
        provideMockActions(() => actions$)
      ]
    })

    effects = TestBed.inject(RubricEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()
  })
})
