import { selectCalendar } from '@selectors/app'
import { Component, EnvironmentInjector, OnInit } from '@angular/core'
import { Observable, zip, map, catchError, scheduled, asapScheduler } from 'rxjs'
import { Calendar } from '@models/calendar'
import { Store } from '@ngrx/store'
import { NavController } from '@ionic/angular'
import { ActivatedRoute } from '@angular/router'
import { filter, switchMap } from 'rxjs/operators'
import { selectCareerById } from '@selectors/career'
import { Career } from '@models/career'
import { AppUser } from '@models/user'
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects'
import { CoordinatorActions } from '@store/coordinator'
import { selectCoordinator } from '@selectors/coordinator'
import { selectUserById } from '@selectors/user'

@Component({
  selector: 'eva-group-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss']
})
export class DetailsPage implements OnInit {
  public calendar$: Observable<Calendar>
  public career$: Observable<Career>
  public coordinator$: Observable<AppUser | undefined>
  private _career$: Observable<string>

  public constructor(
    private readonly nav: NavController,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly actions: Actions,
    public readonly injector: EnvironmentInjector
  ) { }

  public ngOnInit(): void {
    this._career$ = this.route.params.pipe(map(params => params.career))
    this.calendar$ = this.store.select(selectCalendar)
    this.career$ = this._career$.pipe(switchMap(career => this.store.select(selectCareerById(career))))
    this.coordinator$ = this.actions.pipe(
      ofType(CoordinatorActions.loadCoordinatorsSuccess),
      concatLatestFrom(() => zip(this.calendar$, this._career$)),
      switchMap(([_, [calendar, career]]) => this.store.select(selectCoordinator(calendar.id, career))
        .pipe(filter(coordinator => !!coordinator))
      ),
      switchMap(coordinator => this.store.select(selectUserById(coordinator.user))),
      catchError((error) => {
        console.error(error)
        return scheduled([undefined], asapScheduler)
      })
    )
  }

  public back(): void {
    this.nav.back()
  }
}
