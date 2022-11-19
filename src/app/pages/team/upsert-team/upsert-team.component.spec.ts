import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UpsertTeamComponent } from './upsert-team.component'

describe('UpsertTeamComponent', () => {
  let component: UpsertTeamComponent
  let fixture: ComponentFixture<UpsertTeamComponent>

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [UpsertTeamComponent]
    })
      .compileComponents()

    fixture = TestBed.createComponent(UpsertTeamComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
