import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UpsertRubricComponent } from './upsert-rubric.component'

describe('UpsertRubricComponent', () => {
  let component: UpsertRubricComponent
  let fixture: ComponentFixture<UpsertRubricComponent>

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [UpsertRubricComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(UpsertRubricComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
