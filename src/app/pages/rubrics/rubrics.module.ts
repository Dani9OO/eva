import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RubricsPageRoutingModule } from './rubrics-routing.module';

import { RubricsPage } from './rubrics.page';
import { HeaderComponent } from '../../components/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponent,
    RubricsPageRoutingModule
  ],
  declarations: [RubricsPage]
})
export class RubricsPageModule {}
