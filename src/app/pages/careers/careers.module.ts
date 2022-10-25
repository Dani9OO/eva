import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { DegreesPageRoutingModule } from './careers-routing.module'

import { CareersPage } from './careers.page'
import { HeaderComponent } from '@components/header/header.component'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { CareerStoreModule } from '@store/career/career-store.module'
import { UpsertCareerComponent } from './upsert-career/upsert-career.component'
import { CareerItemComponent } from '../../components/career-item/career-item.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponent,
    DegreesPageRoutingModule,
    SpinnerComponent,
    ScrollingModule,
    CareerStoreModule,
    FormsModule,
    ReactiveFormsModule,
    CareerItemComponent
  ],
  declarations: [CareersPage, UpsertCareerComponent]
})
export class DegreesPageModule {}
