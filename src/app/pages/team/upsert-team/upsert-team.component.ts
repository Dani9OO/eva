import { selectActiveCareers, selectCareerById } from '@selectors/career'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, ModalController, SelectCustomEvent, NavController } from '@ionic/angular'
import { GroupStoreModule } from '@store/group/group-store.module'
import { CareerStoreModule } from '@store/career/career-store.module'
import { Store } from '@ngrx/store'
import { Career } from '@models/career'
import { Observable, firstValueFrom, BehaviorSubject } from 'rxjs'
import { CareerActions } from '@store/career'
import { FormFrom } from '@generics/from-form'
import { Project, Team } from '@models/team'
import { FormGroup, FormsModule, ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms'
import { HeaderComponent } from '@components/header/header.component'
import { GroupActions } from '@store/group'
import { selectCalendar, selectTeam } from '@selectors/app'
import { Group } from '@models/group'
import { selectAllGroups, selectGroupById } from '@selectors/group'
import { ShiftPipe } from '@pipes/shift'
import { CareerItemComponent } from '@components/career-item/career-item.component'
import { CareerSelectorComponent } from '@components/career-selector/career-selector.component'
import { TeamActions } from '@store/team'

interface ProjectForm extends FormFrom<Project> {}

interface TeamForm extends FormFrom<Omit<Team, 'members' | 'calendar' | 'id' | 'project'>> {
  project: FormGroup<ProjectForm>
}

@Component({
  selector: 'eva-upsert-team',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    GroupStoreModule,
    CareerStoreModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    ShiftPipe,
    CareerItemComponent,
    CareerSelectorComponent
  ],
  templateUrl: './upsert-team.component.html',
  styleUrls: ['./upsert-team.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertTeamComponent implements OnInit {
  public readonly team$: Observable<Team>
  public readonly careers$: Observable<Career[]>
  public readonly career$: Observable<Career>
  public readonly groups$: Observable<Group[]>
  public readonly group$: Observable<Group>
  public readonly action$: Observable<string>
  public form: FormGroup<TeamForm>
  private readonly _action: BehaviorSubject<string>
  private readonly _career: BehaviorSubject<Career>
  private readonly _group: BehaviorSubject<Group>
  public constructor(
    private readonly store: Store,
    private readonly fb: NonNullableFormBuilder,
    private readonly modal: ModalController,
    private readonly nav: NavController
  ) {
    this.careers$ = this.store.select(selectActiveCareers)
    this.groups$ = this.store.select(selectAllGroups)
    this._career = new BehaviorSubject<Career>(undefined)
    this.career$ = this._career.asObservable()
    this._group = new BehaviorSubject<Group>(undefined)
    this.group$ = this._group.asObservable()
    this._action = new BehaviorSubject<string>('Nuevo')
    this.action$ = this._action.asObservable()
    this.team$ = this.store.select(selectTeam)
  }

  public ngOnInit(): void {
    this.store.dispatch(CareerActions.loadCareers({ force: true }))
    this.form = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      career: this.fb.control('', [Validators.required]),
      group: this.fb.control('', [Validators.required]),
      project: this.fb.group<ProjectForm>({
        name: this.fb.control('', [Validators.required]),
        description: this.fb.control('', [Validators.required, Validators.maxLength(300)])
      })
    })
    this.init()
  }

  public async selectCareer(careers: Career[]): Promise<void> {
    const modal = await this.modal.create({
      component: CareerSelectorComponent,
      componentProps: { careers }
    })
    await modal.present()
    const result = await modal.onWillDismiss()
    if (!result.data && result.role === 'cancel') return
    const data = result.data as Career
    this.selectedCareer(data)
  }

  public async selectedCareer(career: Career): Promise<void> {
    this._career.next(career)
    this.form.controls.career.setValue(career.id)
    const calendar = await firstValueFrom(this.store.select(selectCalendar))
    this.store.dispatch(GroupActions.loadGroups({ calendar: calendar.id, career: career.id, force: true }))
  }

  public selectGroup(ev: Event, groups: Group[]): void {
    const event = ev as SelectCustomEvent<string>
    this._group.next(groups.find(group => group.id === event.detail.value))
  }

  public cancel(): void {
    this.nav.back()
  }

  public async confirm(): Promise<void> {
    const previousTeam = await firstValueFrom(this.team$)
    const team = this.form.getRawValue()
    this.store.dispatch(TeamActions.upsertTeam({ team: { ...previousTeam, ...team } }))
    this.nav.back()
  }

  private async init(): Promise<void> {
    const team = await firstValueFrom(this.store.select(selectTeam))
    if (!team) return
    this._action.next('Editar')
    const { name, career, group, project } = team
    this.form.setValue({ name, career, group, project })
    const c = await firstValueFrom(this.store.select(selectCareerById(career)))
    this.selectedCareer(c)
    const g = await firstValueFrom(this.store.select(selectGroupById(career)))
    this._group.next(g)
  }
}
