import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { TeamPageRoutingModule } from './team-routing.module'

import { TeamPage } from './team.page'
import { HeaderComponent } from '@components/header/header.component'
import { TeamStoreModule } from '@store/team/team-store.module'
import { QRCodeModule } from 'angularx-qrcode'
import { GroupStoreModule } from '@store/group/group-store.module'
import { CareerStoreModule } from '@store/career/career-store.module'
import { ShiftPipe } from '@pipes/shift'
import { CareerItemComponent } from '@components/career-item/career-item.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamPageRoutingModule,
    HeaderComponent,
    TeamStoreModule,
    QRCodeModule,
    GroupStoreModule,
    CareerStoreModule,
    ShiftPipe,
    CareerItemComponent
  ],
  declarations: [TeamPage]
})
export class TeamPageModule {}
