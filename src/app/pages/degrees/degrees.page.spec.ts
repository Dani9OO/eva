import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { DegreesPage } from './degrees.page'

describe('DegreesPage', () => {
  let component: DegreesPage
  let fixture: ComponentFixture<DegreesPage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DegreesPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents()

    fixture = TestBed.createComponent(DegreesPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
