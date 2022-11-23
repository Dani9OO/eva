import { selectAllAssessments } from '@selectors/assessment'
import { selectAllRubrics, selectRubricEntities } from '@selectors/rubric'
import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { TeamActions } from '@store/team'
import { firstValueFrom, Observable, zip, map } from 'rxjs'
import { selectCalendar } from '@selectors/app'
import { PopulatedTeam, Team } from '@models/team'
import { selectAllTeams } from '@selectors/team'
import { selectGroupEntities } from '@selectors/group'
import { selectActiveCareers, selectCareerEntities } from '@selectors/career'
import { Career } from '@models/career'

@Component({
  selector: 'eva-grades',
  templateUrl: './grades.page.html',
  styleUrls: ['./grades.page.scss']
})
export class GradesPage implements OnInit {
  public careers$: Observable<Career[]>
  public teams$: Observable<{ [k: string]: PopulatedTeam[] }>
  public _teams$: Observable<Team[]>

  public constructor(
    private readonly store: Store
  ) {
    this.teams$ = zip(
      this.store.select(selectAllTeams),
      this.store.select(selectRubricEntities),
      this.store.select(selectGroupEntities),
      this.store.select(selectAllAssessments),
      this.store.select(selectAllRubrics),
      this.store.select(selectCareerEntities)
    ).pipe(
      map(([teams, rubrics, groups, assessments, rubricArray, careers]) => {
        const groupedTeams: { [k: string]: PopulatedTeam[] } = {}
        teams.forEach(team => {
          const initialValue = 0
          const group = groups[team.group]
          const maxGrade = rubricArray
            .filter(r => r.calendar === team.calendar && r.career === team.career)
            .map(r => r.weight[group.quarter])
            .reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              initialValue
            )
          const teamAssessments = assessments
            .filter(a => a.team === team.id)
          const grades = teamAssessments
            .flatMap(a => a.result.map(r => ((rubrics[r.rubric].weight[group.quarter] * r.grade) / 10)))
          const l = grades.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            initialValue
          ) / teamAssessments.length
          const grade = (l * 10) / maxGrade
          const result = { ...team, group: groups[team.group], grade, career: careers[team.career] }
          if (groupedTeams[team.career]) groupedTeams[team.career].push(result)
          else groupedTeams[team.career] = [result]
        })
        return groupedTeams
      })
    )
    this.careers$ = this.store.select(selectActiveCareers)
  }

  public async ngOnInit(): Promise<void> {
    const calendar = await firstValueFrom(this.store.select(selectCalendar))
    this.store.dispatch(TeamActions.loadTeams({ calendar: calendar.id }))
  }

  public async share(): Promise<void> {
    const export$ = this.teams$.pipe(
      map(t => {
        const csv = Object.keys(t).flatMap(k => t[k].map(team =>
          `${team.career.name},${team.name},${team.project.name},${team.grade}`
        ))
        csv.splice(0, 0, 'Carrera,Equipo,Proyecto,Calificación')
        return csv.join('\n')
      })
    )
    const teams = await firstValueFrom(export$)
    const blob = new Blob(['\ufeff' + teams], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }
}
