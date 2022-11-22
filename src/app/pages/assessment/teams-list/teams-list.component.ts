import { selectAllAssessments } from '@selectors/assessment'
import { selectGroupEntities } from '@selectors/group'
import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { TeamActions } from '@store/team'
import { firstValueFrom, map, Observable, zip } from 'rxjs'
import { selectCalendar } from '@selectors/app'
import { ActivatedRoute } from '@angular/router'
import { Team, TeamWithGroup } from '@models/team'
import { Group } from '@models/group'
import { selectAllTeams } from '@selectors/team'
import { Dictionary } from '@ngrx/entity'
import { Career } from '@models/career'
import { selectCareerById } from '@selectors/career'
import { switchMap } from 'rxjs/operators'
import { NavController, ModalController } from '@ionic/angular'
import { selectRubricsMissing } from '@selectors/rubric'
import { UpsertAssessmentComponent } from '../upsert-assessment/upsert-assessment.component'

@Component({
  selector: 'eva-teams-list',
  templateUrl: './teams-list.component.html',
  styleUrls: ['./teams-list.component.scss']
})
export class TeamsListComponent implements OnInit {
  public teams$: Observable<TeamWithGroup[]>
  public career$: Observable<Career>
  public rubrics$: Observable<boolean>
  private _career$: Observable<string>
  private _teams$: Observable<Team[]>
  private _groups$: Observable<Dictionary<Group>>

  public constructor(
    private store: Store,
    private route: ActivatedRoute,
    private nav: NavController,
    private modal: ModalController
  ) {
    this.rubrics$ = this.store.select(selectRubricsMissing)
    this._career$ = this.route.params.pipe(map(params => params.career))
    this.career$ = this._career$.pipe(switchMap(id => this.store.select(selectCareerById(id))))
    this._teams$ = this.store.select(selectAllTeams)
    this._groups$ = this.store.select(selectGroupEntities)
    this.teams$ = zip(this._teams$, this._groups$).pipe(
      map(([teams, groups]) => teams.map(team => ({ ...team, group: groups[team.group] || undefined })))
    )
  }

  public async ngOnInit(): Promise<void> {
    const calendar = await firstValueFrom(this.store.select(selectCalendar))
    const career = await firstValueFrom(this._career$)
    this.store.dispatch(TeamActions.loadTeams({ calendar: calendar.id, career }))
  }

  public async assess(team: TeamWithGroup): Promise<void> {
    const assessments = await firstValueFrom(this.store.select(selectAllAssessments))
    const modal = await this.modal.create({
      component: UpsertAssessmentComponent,
      componentProps: {
        assessment: assessments.find(a => a.team === team.id),
        team
      }
    })
    await modal.present()
  }

  public back(): void {
    this.nav.back()
  }
}
