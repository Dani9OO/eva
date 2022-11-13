import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { NonNullableFormBuilder, FormGroup, Validators } from '@angular/forms'
import { FormFrom } from '@generics/from-form'
import { Career, Degree } from '@models/career'
import { ModalController } from '@ionic/angular'
import { Subscription } from 'rxjs'
import { CareerService } from '@services/career'

type CareerForm = FormFrom<Omit<Career, 'archived' | 'id'>>

@Component({
  selector: 'eva-upsert-career',
  templateUrl: './upsert-career.component.html',
  styleUrls: ['./upsert-career.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertCareerComponent implements OnInit, OnDestroy {
  @Input() public career: Career
  public form: FormGroup<CareerForm>
  public readonly icons = [
    'desktop',
    'qr-code',
    'people',
    'cash',
    'business',
    'construct',
    'leaf',
    'flask',
    'build',
    'cog'
  ]

  public selected: number
  private sub: Subscription

  public constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly modal: ModalController,
    private readonly careerService: CareerService
  ) {}

  public ngOnInit(): void {
    this.form = this.fb.group<CareerForm>({
      abrv: this.fb.control<string>(this.career?.abrv || ''),
      name: this.fb.control<string>(this.career?.name || '', [Validators.required]),
      degree: this.fb.control<Degree>(this.career?.degree || 'TSU', [Validators.required]),
      icon: this.fb.control<string>(this.career?.icon || '', [Validators.required])
    })
    this.sub = this.form.controls.name.valueChanges.subscribe(name =>
      this.form.controls.abrv.setValue(this.careerService.getAbbreviation(name))
    )
  }

  public ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe()
  }

  public cancel(): void {
    this.modal.dismiss(undefined, 'cancel')
  }

  public confirm(): void {
    this.modal.dismiss(this.form.value, 'confirm')
  }

  public selectIcon(index: number): void {
    this.form.controls.icon.setValue(this.icons[index])
  }
}
