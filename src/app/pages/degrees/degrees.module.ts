import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DegreesPageRoutingModule } from './degrees-routing.module';

import { DegreesPage } from './degrees.page';
import { EvaHeaderComponent } from '../../components/eva-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaHeaderComponent,
    DegreesPageRoutingModule
  ],
  declarations: [DegreesPage]
})
export class DegreesPageModule {}
