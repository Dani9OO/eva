import { TestBed } from '@angular/core/testing'

import { AlumniGuard } from './alumni.guard'

describe('AlumniGuard', () => {
  let guard: AlumniGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(AlumniGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
