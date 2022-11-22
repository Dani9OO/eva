import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { RubricsPageRoutingModule } from './rubrics-routing.module'

import { RubricsPage } from './rubrics.page'
import { HeaderComponent } from '@components/header/header.component'
import { RubricStoreModule } from '@store/rubric/rubric-store.module'
import { CareerItemComponent } from '@components/career-item/career-item.component'
import { CareerStoreModule } from '@store/career/career-store.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RubricsPageRoutingModule,
    HeaderComponent,
    RubricStoreModule,
    CareerItemComponent,
    CareerStoreModule
  ],
  declarations: [RubricsPage]
})
export class RubricsPageModule {}
