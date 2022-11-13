import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { IonicModule } from '@ionic/angular'
import { CareerItemComponent } from '@components/career-item/career-item.component'
import { HeaderComponent } from '@components/header/header.component'
import { CoordinatorStoreModule } from '@store/coordinator/coordinator-store.module'
import { GroupStoreModule } from '@store/group/group-store.module'
import { RubricStoreModule } from '@store/rubric/rubric-store.module'
import { UserStoreModule } from '@store/user/user-store.module'
import { DetailsPage } from './details.page'
import { DetailsPageRoutingModule } from './details-routing.module'

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    CareerItemComponent,
    GroupStoreModule,
    UserStoreModule,
    CoordinatorStoreModule,
    RubricStoreModule,
    DetailsPageRoutingModule
  ],
  declarations: [DetailsPage]
})
export class DetailsPageModule {}
