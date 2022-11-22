import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { assessmentFeatureKey, reducer } from './assessment.reducer'
import { AssessmentEffects } from './assessment.effects'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(assessmentFeatureKey, reducer),
    EffectsModule.forFeature([AssessmentEffects])
  ]
})
export class AssessmentStoreModule { }
