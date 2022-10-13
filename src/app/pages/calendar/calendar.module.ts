import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarPageRoutingModule } from './calendar-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { CalendarPage } from './calendar.page';
import { HeaderComponent } from '../../components/header/header.component';
import { StoreModule } from '@ngrx/store';
import { reducer, calendarFeatureKey } from './calendar.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CalendarEffects } from './calendar.effects';

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
    StoreModule.forFeature(calendarFeatureKey, reducer),
    EffectsModule.forFeature([CalendarEffects])
  ],
  declarations: [CalendarPage]
})
export class CalendarPageModule {}
