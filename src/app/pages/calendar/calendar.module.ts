import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { CalendarPageRoutingModule } from './calendar-routing.module'
import { ScrollingModule } from '@angular/cdk/scrolling'

import { CalendarPage } from './calendar.page'
import { HeaderComponent } from '@components/header/header.component'
import { CalendarStoreModule } from '../../store/calendar/calendar-store.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    ScrollingModule,
    CalendarStoreModule
  ],
  declarations: [CalendarPage]
})
export class CalendarPageModule {}
