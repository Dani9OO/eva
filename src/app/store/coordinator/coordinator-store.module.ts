import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { coordinatorFeatureKey, reducer } from './coordinator.reducer'
import { CoordinatorEffects } from './coordinator.effects'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(coordinatorFeatureKey, reducer),
    EffectsModule.forFeature([CoordinatorEffects])
  ]
})
export class CoordinatorStoreModule { }
