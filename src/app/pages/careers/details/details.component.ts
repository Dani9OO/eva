import { selectCalendar } from '@selectors/app'
import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HeaderComponent } from '@components/header/header.component'
import { Observable, zip, map, catchError, scheduled, asapScheduler, firstValueFrom } from 'rxjs'
import { Calendar } from '@models/calendar'
import { Store } from '@ngrx/store'
import { IonicModule, NavController, ModalController } from '@ionic/angular'
import { CareerItemComponent } from '@components/career-item/career-item.component'
import { ActivatedRoute } from '@angular/router'
import { filter, switchMap } from 'rxjs/operators'
import { selectCareerById } from '@selectors/career'
import { Career } from '@models/career'
import { AppUser } from '@models/user'
import { Actions, concatLatestFrom, ofType } from '@ngrx/effects'
import { CoordinatorActions } from '@store/coordinator'
import { selectCoordinator } from '@selectors/coordinator'
import { selectUserById } from '@selectors/user'
import { GroupActions } from '@store/group'
import { GroupsComponent } from '../groups/groups.component'
import { GroupStoreModule } from '../../../store/group/group-store.module'
import { SpinnerService } from '@services/spinner'
import { SelectCoordinatorComponent } from '../select-coordinator/select-coordinator.component'
import { UserActions } from '@store/user'
import { UserStoreModule } from '@store/user/user-store.module'
import { UserItemComponent } from '@components/user-item/user-item.component'
import { CoordinatorStoreModule } from '@store/coordinator/coordinator-store.module'

@Component({
  selector: 'eva-details',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    CareerItemComponent,
    GroupStoreModule,
    UserStoreModule,
    UserItemComponent,
    CoordinatorStoreModule
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
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
    private readonly spinner: SpinnerService
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

  public async selectCoordinator(career: Career, calendar: Calendar, coordinator?: string): Promise<void> {
    this.store.dispatch(UserActions.loadUsers({ force: true }))
    const modal = await this.modal.create({
      component: SelectCoordinatorComponent,
      componentProps: { career, calendar, coordinator }
    })
    await modal.present()
  }
}
