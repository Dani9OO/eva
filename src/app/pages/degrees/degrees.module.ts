import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { DegreesPageRoutingModule } from './degrees-routing.module'

import { DegreesPage } from './degrees.page'
import { HeaderComponent } from '../../components/header/header.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponent,
    DegreesPageRoutingModule
  ],
  declarations: [DegreesPage]
})
export class DegreesPageModule {}
