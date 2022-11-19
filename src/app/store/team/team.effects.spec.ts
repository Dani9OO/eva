import { TestBed } from '@angular/core/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable } from 'rxjs'

import { TeamEffects } from './team.effects'

describe('CalendarEffects', () => {
  let actions$: Observable<any>
  let effects: TeamEffects

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeamEffects,
        provideMockActions(() => actions$)
      ]
    })

    effects = TestBed.inject(TeamEffects)
  })

  it('should be created', () => {
    expect(effects).toBeTruthy()
  })
})
