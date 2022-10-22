import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UpsertCareerComponent } from './upsert-career.component'

describe('UpsertCareerComponent', () => {
  let component: UpsertCareerComponent
  let fixture: ComponentFixture<UpsertCareerComponent>

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [UpsertCareerComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(UpsertCareerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
