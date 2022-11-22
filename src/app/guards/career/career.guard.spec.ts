import { TestBed } from '@angular/core/testing'

import { CareerGuard } from './career.guard'

describe('CareerGuard', () => {
  let guard: CareerGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(CareerGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
