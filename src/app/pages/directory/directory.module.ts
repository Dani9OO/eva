import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectoryPageRoutingModule } from './directory-routing.module';

import { DirectoryPage } from './directory.page';
import { HeaderComponent } from '../../components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectoryPageRoutingModule,
    HeaderComponent
  ],
  declarations: [DirectoryPage]
})
export class DirectoryPageModule {}
