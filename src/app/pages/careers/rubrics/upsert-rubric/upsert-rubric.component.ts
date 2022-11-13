import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Quarters } from '@constants/quarters'
import { Rubric, Skills, Weight } from '@models/rubric'
import { FormFrom } from '@generics/from-form'
import { Store } from '@ngrx/store'
import { Career } from '@models/career'
import { RubricActions } from '@store/rubric'
import { Calendar } from '@models/calendar'
import { Subscription } from 'rxjs'
import { ModalController, IonicModule } from '@ionic/angular'
import { RubricStoreModule } from '@store/rubric/rubric-store.module'
import { CareerItemComponent } from '../../../../components/career-item/career-item.component'
import { QuarterPipe } from '@pipes/quarter'
import { numberWithOneDecimal } from '@constants/regexp'

interface RubricForm extends FormFrom<Omit<Rubric, 'calendar' | 'career' | 'id' | 'category'>> {
  category: FormControl<string>
}

interface WeightSettings {
  advanced: boolean
  weight: {
    standard: string
    advanced: string
  }
}

interface WeightForm extends FormFrom<WeightSettings> {}

@Component({
  selector: 'eva-upsert-rubric',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RubricStoreModule, ReactiveFormsModule, CareerItemComponent, QuarterPipe],
  templateUrl: './upsert-rubric.component.html',
  styleUrls: ['./upsert-rubric.component.scss']
})
export class UpsertRubricComponent implements OnInit {
  @Input() public career: Career
  @Input() public calendar: Calendar
  @Input() public rubric?: Rubric
  public form: FormGroup<RubricForm>
  public weight: FormGroup<WeightForm>
  public quarters: Quarters
  private sub: Subscription
  public constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly store: Store,
    private readonly modal: ModalController
  ) {
    this.sub = new Subscription()
  }

  public ngOnInit(): void {
    this.quarters = new Quarters(this.career.degree)
    this.form = this.fb.group({
      criteria: this.fb.control(this.rubric?.criteria || ''),
      skills: this.fb.control<Skills>(this.rubric?.skills || 'HARD'),
      category: this.fb.control(this.rubric?.category || ''),
      weight: this.weightForm()
    })
    this.weight = this.fb.group({
      advanced: this.fb.control<boolean>(false),
      weight: this.fb.group({
        standard: this.fb.control(this.rubric?.weight[this.quarters.all.at(0)].toString() || '', [
          Validators.min(0),
          Validators.max(10),
          Validators.pattern(numberWithOneDecimal),
          Validators.required
        ]),
        advanced: this.fb.control(this.rubric?.weight[this.quarters.all.at(-1)].toString(), [
          Validators.min(0),
          Validators.max(10),
          Validators.pattern(numberWithOneDecimal),
          Validators.required
        ])
      })
    })
    this.sub.add(
      this.weight.valueChanges.subscribe(() => {
        this.setWeight(this.weight.getRawValue())
      })
    )
  }

  public back(): void {
    this.modal.dismiss()
  }

  public save(): void {
    const rubric = this.form.getRawValue()
    Object.keys(rubric.weight).forEach(k => { if (!rubric.weight[k]) delete rubric.weight[k] })
    this.store.dispatch(RubricActions.upsertRubric({
      rubric: { calendar: this.calendar.id, career: this.career.id, ...rubric }
    }))
    this.modal.dismiss(undefined, 'confirm')
  }

  private weightForm(): FormGroup<FormFrom<Weight>> {
    const weightForm = this.fb.group({})
    this.quarters.all.forEach(q => weightForm.addControl(
      String(q),
      this.fb.control(this.rubric?.weight[q] ?? 0, [
        Validators.min(0),
        Validators.max(10),
        Validators.pattern(numberWithOneDecimal),
        Validators.required
      ])
    ))
    return weightForm as unknown as FormGroup<FormFrom<Weight>>
  }

  private setWeight(settings: WeightSettings): void {
    if (this.career.degree === 'TSU') {
      if (!settings.advanced) this.quarters.standard.forEach(q =>
        this.form.controls.weight.controls[String(q)].setValue(Number(settings.weight.standard))
      )
      this.quarters.advanced.forEach(q => this.form.controls.weight.controls[String(q)].setValue(Number(settings.weight.advanced)))
    } else {
      this.quarters.all.forEach(q => this.form.controls.weight.controls[String(q)].setValue(Number(settings.weight.advanced)))
    }
  }
}
