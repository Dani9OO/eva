import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { rubricFeatureKey, reducer } from './rubric.reducer'
import { RubricEffects } from './rubric.effects'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(rubricFeatureKey, reducer),
    EffectsModule.forFeature([RubricEffects])
  ]
})
export class RubricStoreModule { }
