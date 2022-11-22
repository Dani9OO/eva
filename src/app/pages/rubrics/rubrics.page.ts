import { Component, OnInit } from '@angular/core'
import { Career } from '@models/career'
import { Store } from '@ngrx/store'
import { CareerActions } from '@store/career'
import { selectCareersIn } from '@selectors/career'
import { Observable } from 'rxjs'
import { selectUser } from '@selectors/app'
import { switchMap } from 'rxjs/operators'

@Component({
  selector: 'eva-rubrics',
  templateUrl: './rubrics.page.html',
  styleUrls: ['./rubrics.page.scss']
})
export class RubricsPage implements OnInit {
  public careers$: Observable<Career[]>

  public constructor(
    private readonly store: Store
  ) {
    this.careers$ = this.store.select(selectUser).pipe(
      switchMap(user => this.store.select(selectCareersIn(user.careers)))
    )
  }

  public ngOnInit(): void {
    this.store.dispatch(CareerActions.loadCareers({}))
  }
}
