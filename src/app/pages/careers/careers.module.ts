import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { DegreesPageRoutingModule } from './careers-routing.module'

import { CareersPage } from './careers.page'
import { HeaderComponent } from '@components/header/header.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponent,
    DegreesPageRoutingModule
  ],
  declarations: [CareersPage]
})
export class DegreesPageModule {}
