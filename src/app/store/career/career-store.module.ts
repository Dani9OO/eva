import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { careerFeatureKey, reducer } from './career.reducer'
import { CareerEffects } from './career.effects'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(careerFeatureKey, reducer),
    EffectsModule.forFeature([CareerEffects])
  ]
})
export class CareerStoreModule { }
