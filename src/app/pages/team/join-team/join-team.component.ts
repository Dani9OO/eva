import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule, ModalController } from '@ionic/angular'
import { FormsModule, ReactiveFormsModule, NonNullableFormBuilder, FormControl, Validators } from '@angular/forms'
import { HeaderComponent } from '@components/header/header.component'

@Component({
  selector: 'eva-join-team',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './join-team.component.html',
  styleUrls: ['./join-team.component.scss']
})
export class JoinTeamComponent {
  public team: FormControl<string>

  public constructor(
    private readonly modal: ModalController,
    private readonly fb: NonNullableFormBuilder
  ) {
    this.team = this.fb.control('', Validators.required)
  }

  public cancel(): void {
    this.modal.dismiss(undefined, 'cancel')
  }

  public confirm(): void {
    this.modal.dismiss(this.team.getRawValue(), 'confirm')
  }
}
