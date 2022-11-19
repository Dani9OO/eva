import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { CareerActions } from '@store/career'
import { Observable } from 'rxjs'
import { Career } from '@models/career'
import { selectActiveCareers } from '@selectors/career'

@Component({
  selector: 'eva-assessment',
  templateUrl: './assessment.page.html',
  styleUrls: ['./assessment.page.scss']
})
export class AssessmentPage implements OnInit {
  public careers$: Observable<Career[]>

  public constructor(
    private readonly store: Store
  ) {
    this.careers$ = this.store.select(selectActiveCareers)
  }

  public ngOnInit(): void {
    this.store.dispatch(CareerActions.loadCareers({}))
  }
}
