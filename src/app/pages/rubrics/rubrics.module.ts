import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RubricsPageRoutingModule } from './rubrics-routing.module';

import { RubricsPage } from './rubrics.page';
import { EvaHeaderComponent } from '../../components/eva-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EvaHeaderComponent,
    RubricsPageRoutingModule
  ],
  declarations: [RubricsPage]
})
export class RubricsPageModule {}
