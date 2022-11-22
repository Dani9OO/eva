import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UpsertAssessmentComponent } from './upsert-assessment.component'

describe('UpsertAssessmentComponent', () => {
  let component: UpsertAssessmentComponent
  let fixture: ComponentFixture<UpsertAssessmentComponent>

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [UpsertAssessmentComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(UpsertAssessmentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
