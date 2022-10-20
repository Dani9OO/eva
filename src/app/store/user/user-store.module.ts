import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { UserEffects } from './user.effects'
import { StoreModule } from '@ngrx/store'
import { usersFeatureKey, reducer } from './user.reducer'

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(usersFeatureKey, reducer),
    EffectsModule.forFeature([UserEffects])
  ]
})
export class UserStoreModule { }
