import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { AppService } from '../../services/app/app.service';
import { ModalController } from '@ionic/angular';
import { DateRangeComponent } from '../../components/date-range/date-range.component';

@Component({
  selector: 'eva-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  public calendars: FormArray<FormArray<FormControl<string>>>

  constructor(
    private fb: NonNullableFormBuilder,
    private modal: ModalController
  ) {

  }

  ngOnInit() {
    this.calendars = this.fb.array<FormArray<FormControl<string>>>([])
  }

  setDate(index: number): void {

  }

  public async newCalendar(): Promise<void> {
    const modal = await this.modal.create({
      component: DateRangeComponent
    })
    await modal.present();
  }

}
