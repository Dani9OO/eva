import { Component, EnvironmentInjector, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NavController, ModalController, IonicModule } from '@ionic/angular'
import { Calendar } from '@models/calendar'
import { Career } from '@models/career'
import { AppUser } from '@models/user'
import { ofType, concatLatestFrom, Actions } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { SpinnerService } from '@services/spinner'
import { selectCalendar } from '@selectors/app'
import { selectCareerById } from '@selectors/career'
import { CoordinatorActions } from '@store/coordinator'
import { selectCoordinator } from '@selectors/coordinator'
import { GroupActions } from '@store/group'
import { RubricActions } from '@store/rubric'
import { UserActions } from '@store/user'
import { selectUserById } from '@selectors/user'
import { Observable, map, switchMap, zip, filter, catchError, scheduled, asapScheduler, firstValueFrom } from 'rxjs'
import { GroupsComponent } from '../../groups/groups.component'
import { SelectCoordinatorComponent } from '../../select-coordinator/select-coordinator.component'
import { CommonModule } from '@angular/common'
import { UserItemComponent } from '@components/user-item/user-item.component'
import { HeaderComponent } from '@components/header/header.component'
import { CareerItemComponent } from '@components/career-item/career-item.component'

@Component({
  selector: 'eva-group-details-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, UserItemComponent, HeaderComponent, CareerItemComponent]
})
export class MenuComponent implements OnInit {
  public calendar$: Observable<Calendar>
  public career$: Observable<Career>
  public coordinator$: Observable<AppUser | undefined>
  private _career$: Observable<string>

  public constructor(
    private readonly nav: NavController,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly actions: Actions,
    private readonly modal: ModalController,
    private readonly spinner: SpinnerService,
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

  public async groups(career: Career, calendar: Calendar): Promise<void> {
    try {
      this.spinner.spin()
      this.store.dispatch(GroupActions.loadGroups({ calendar: calendar.id, career: career.id }))
      const { groups } = await firstValueFrom(this.actions.pipe(ofType(GroupActions.loadGroupsSuccess)))
      this.spinner.stop()
      const modal = await this.modal.create({
        component: GroupsComponent,
        componentProps: { career, calendar, groups }
      })
      await modal.present()
    } catch (error) {
      this.spinner.stop()
    }
  }

  public async rubrics(calendar: Calendar, career: Career): Promise<void> {
    this.store.dispatch(RubricActions.loadRubrics({ calendar: calendar.id, career: career.id }))
    await this.nav.navigateForward(['careers', career.id, 'rubrics'])
  }

  public async selectCoordinator(career: Career, calendar: Calendar, coordinator?: string): Promise<void> {
    this.store.dispatch(UserActions.loadUsers({ force: true }))
    const modal = await this.modal.create({
      component: SelectCoordinatorComponent,
      componentProps: { career, calendar, coordinator }
    })
    await modal.present()
  }
}
