import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { teamFeatureKey, reducer } from './team.reducer'
import { TeamEffects } from './team.effects'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(teamFeatureKey, reducer),
    EffectsModule.forFeature([TeamEffects])
  ]
})
export class TeamStoreModule { }
