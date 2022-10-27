import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { DirectoryPageRoutingModule } from './directory-routing.module'

import { DirectoryPage } from './directory.page'
import { HeaderComponent } from '@components/header/header.component'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { UserStoreModule } from '../../store/user/user-store.module'
import { SpinnerComponent } from '@components/spinner/spinner.component'
import { UserItemComponent } from '@components/user-item/user-item.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectoryPageRoutingModule,
    HeaderComponent,
    ScrollingModule,
    UserStoreModule,
    SpinnerComponent,
    UserItemComponent
  ],
  declarations: [DirectoryPage]
})
export class DirectoryPageModule {}
