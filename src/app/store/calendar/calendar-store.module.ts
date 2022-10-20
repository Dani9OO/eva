import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { calendarFeatureKey, reducer } from './calendar.reducer'
import { CalendarEffects } from './calendar.effects'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(calendarFeatureKey, reducer),
    EffectsModule.forFeature([CalendarEffects])
  ]
})
export class CalendarStoreModule { }
