import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { AssessmentEffects } from './assessment.effects'

describe('CalendarEffects', () => {
  let actions$: Observable<any>
  let effects: AssessmentEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssessmentEffects,
        provideMockActions(() => actions$)
      ]
    })

    effects = TestBed.inject(AssessmentEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()
  })
})
