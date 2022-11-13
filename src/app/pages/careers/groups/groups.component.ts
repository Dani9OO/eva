import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, ModalController } from '@ionic/angular'
import { CareerItemComponent } from '@components/career-item/career-item.component'
import { Career } from '@models/career'
import { NonNullableFormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms'
import { FormFrom } from '@generics/from-form'
import { Subscription } from 'rxjs'
import { Group, Quarter, Shift } from '@models/group'
import { Store } from '@ngrx/store'
import { Calendar } from '@models/calendar'
import { alphabet } from '@constants/alphabet'
import { QuarterPipe } from '@pipes/quarter'
import { GroupStoreModule } from '@store/group/group-store.module'
import { GroupActions } from '@store/group'
import { SpinnerComponent } from '@components/spinner/spinner.component'

interface ShiftForm extends FormFrom<{ morning: boolean, evening: boolean }> {}

// shift, quarter, group
interface GroupsForm extends FormFrom<{ [k: string]: { [k: string]: { [k: string]: boolean } } }> {}

@Component({
  selector: 'eva-groups',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    CareerItemComponent,
    ReactiveFormsModule,
    FormsModule,
    QuarterPipe,
    GroupStoreModule,
    SpinnerComponent
  ],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent implements OnInit {
  @Input() public career: Career
  @Input() public calendar: Calendar
  @Input() public groups?: Group[]
  public shifts: FormGroup<ShiftForm>
  public groupsForm: FormGroup<GroupsForm>
  public sub: Subscription
  public quarters: { morning: string[], evening: string[] }
  private _quarters: Quarter[]

  public constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly store: Store,
    private readonly modal: ModalController
  ) {
    this.sub = new Subscription()
    this.quarters = { morning: [], evening: [] }
  }

  public ngOnInit(): void {
    this._quarters = this.career.degree === 'TSU' ? [1, 2, 3, 4, 5, 6] : [7, 8, 9, 10]
    this.shifts = this.fb.group({
      morning: this.fb.control<boolean>(this.groups?.some(g => g.shift === 'morning')),
      evening: this.fb.control<boolean>(this.groups?.some(g => g.shift === 'evening'))
    })
    this.groupsForm = this.getFormFromGroups(this.groups)
    this.sub.add(this.shifts.controls.morning.valueChanges.subscribe(s => this.shiftChange('morning', s)))
    this.sub.add(this.shifts.controls.evening.valueChanges.subscribe(s => this.shiftChange('evening', s)))
  }

  public back(): void {
    this.modal.dismiss(undefined, 'cancel')
  }

  public addGroup(shift: Shift, quarter: string): void {
    if (!this.groupsForm.controls[shift].controls[quarter]) return
    const count = Object.keys(this.groupsForm.controls[shift].controls[quarter].controls).length
    this.groupsForm.controls[shift].controls[quarter].addControl(alphabet[count], this.fb.control(false))
  }

  public getGroups(shift: Shift, quarter: string): string[] {
    return this.groupsForm.controls[shift].controls[quarter]?.controls
      ? Object.keys(this.groupsForm.controls[shift].controls[quarter].controls)
      : []
  }

  public save(calendar: Calendar): void {
    const { morning, evening } = this.groupsForm.value
    const groups = [
      ...this.mapFormToGroups(calendar, 'morning', morning),
      ...this.mapFormToGroups(calendar, 'evening', evening)
    ]
    this.store.dispatch(GroupActions.upsertGroups({ calendar: calendar.id, career: this.career.id, groups }))
    this.modal.dismiss(undefined, 'confirm')
  }

  private shiftChange(shift: Shift, enabled: boolean): void {
    const morning = shift === 'morning'
    if (!enabled) {
      this.quarters[shift] = []
      this.quarters[shift].forEach(q => this.groupsForm.controls.shift.removeControl(q))
      return
    }
    const quarters = [...this._quarters]
    if (morning && this.career.degree === 'TSU') quarters.pop()
    const form = this.fb.group({})
    quarters.forEach(q => form.addControl(String(q), this.newQuarterForm()))
    this.groupsForm.addControl(shift, form)
    this.quarters[shift] = Object.keys(this.groupsForm.controls[shift].controls)
  }

  private newQuarterForm(): FormGroup<{ [k: string]: FormControl<boolean> }> {
    const form = this.fb.group({})
    form.addControl(alphabet[0], this.fb.control<boolean>(false))
    return form
  }

  private mapFormToGroups(calendar: Calendar, shift: Shift, form?: Partial<{ [x: string]: Partial<{ [x: string]: boolean }> }>): Group[] {
    return form
      ? Object.keys(form).flatMap(quarter =>
        Object.keys(form[quarter])
          .filter(g => form[quarter][g])
          .map(group => ({
            calendar: calendar.id,
            career: this.career.id,
            letter: group,
            quarter: Number(quarter) as Quarter,
            shift
          })))
      : []
  }

  private mapGroupsToForm(shift: Shift, groups: Group[]): FormGroup<FormFrom<{ [k: string]: { [k: string]: boolean } }>> {
    const quarters = [...this._quarters]
    if (shift === 'morning' && this.career.degree === 'TSU') quarters.pop()
    const form: { [k: string]: FormGroup<{ [k: string]: FormControl<boolean> }> } = {}
    quarters.forEach(quarter => {
      this.quarters[shift].push(String(quarter))
      const quarterForm: { [k: string]: FormControl<boolean> } = {}
      const index = alphabet.findIndex(letter => letter === groups.at(-1).letter) + 1
      alphabet.slice(0, index).forEach((letter, i) => {
        const condition = !groups.some(g => g.letter === letter && g.quarter === quarter)
        if (condition && i !== 0) return
        if (condition && i === 0) quarterForm[letter] = this.fb.control(false)
        else quarterForm[letter] = this.fb.control(true)
      })
      form[String(quarter)] = this.fb.group(quarterForm)
    })
    return this.fb.group(form)
  }

  private getFormFromGroups(groups?: Group[]): FormGroup<GroupsForm> {
    const groupsForm = this.fb.group({})
    const morning = groups?.filter(g => g.shift === 'morning')
    const evening = groups?.filter(g => g.shift === 'evening')
    if (morning?.length > 0) groupsForm.addControl('morning', this.mapGroupsToForm('morning', morning))
    if (evening?.length > 0) groupsForm.addControl('evening', this.mapGroupsToForm('evening', evening))
    return groupsForm
  }
}
