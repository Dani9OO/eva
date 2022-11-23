import { selectRubrics } from '@selectors/rubric'
import { Component, Input, OnInit } from '@angular/core'
import { Rubric } from '@models/rubric'
import { TeamWithGroup } from '@models/team'
import { Store } from '@ngrx/store'
import { Observable, map, firstValueFrom } from 'rxjs'
import { NonNullableFormBuilder, FormControl, FormGroup } from '@angular/forms'
import { ModalController } from '@ionic/angular'
import { Assessment, Grade } from '@models/assessment'
import { selectUser } from '@selectors/app'
import { AssessmentActions } from '@store/assessment'

@Component({
  selector: 'eva-upsert-assessment',
  templateUrl: './upsert-assessment.component.html',
  styleUrls: ['./upsert-assessment.component.scss']
})
export class UpsertAssessmentComponent implements OnInit {
  @Input() public team: TeamWithGroup
  @Input() public assessment?: Assessment
  public categories$: Observable<string[]>
  public rubrics$: Observable<{ [k: string]: Rubric[] }>
  public form: FormGroup<{ [k: string]: FormControl<Grade> }>

  public constructor(
    private readonly store: Store,
    private readonly fb: NonNullableFormBuilder,
    private readonly modal: ModalController
  ) {}

  public async ngOnInit(): Promise<void> {
    this.rubrics$ = this.store.select(selectRubrics(this.team.calendar, this.team.career))
    this.categories$ = this.rubrics$.pipe(map(rubrics => rubrics ? Object.keys(rubrics) : []))
    this.form = this.fb.group({})
    const rubricMap = await firstValueFrom(this.rubrics$)
    for (const rubric of Object.values(rubricMap).flatMap(category => category)) {
      const a = this.assessment?.result.find(assessment => assessment.rubric === rubric.id)
      this.form.addControl(rubric.id, this.fb.control<Grade>(a?.grade ?? 10))
    }
  }

  public cancel(): void {
    this.modal.dismiss()
  }

  public async save(): Promise<void> {
    const user = await firstValueFrom(this.store.select(selectUser))
    const grades = this.form.getRawValue()
    const assessment: Assessment = {
      id: this.assessment?.id,
      createdBy: user.id,
      calendar: this.team.calendar,
      career: this.team.career,
      group: this.team.group.id,
      team: this.team.id,
      result: Object.keys(grades).map(key => ({ rubric: key, grade: grades[key] }))
    }
    this.store.dispatch(AssessmentActions.upsertAssessment({ assessment }))
    this.modal.dismiss()
  }
}
