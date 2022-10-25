import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { groupFeatureKey, reducer } from './group.reducer'
import { GroupEffects } from './group.effects'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(groupFeatureKey, reducer),
    EffectsModule.forFeature([GroupEffects])
  ]
})
export class GroupStoreModule { }
