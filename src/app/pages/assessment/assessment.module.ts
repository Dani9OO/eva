import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { AssessmentPageRoutingModule } from './assessment-routing.module'

import { AssessmentPage } from './assessment.page'
import { CareerItemComponent } from '@components/career-item/career-item.component'
import { TeamsListComponent } from './teams-list/teams-list.component'
import { TeamStoreModule } from '@store/team/team-store.module'
import { HeaderComponent } from '@components/header/header.component'
import { UpsertAssessmentComponent } from './upsert-assessment/upsert-assessment.component'
import { AssessmentStoreModule } from '@store/assessment/assessment-store.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssessmentPageRoutingModule,
    CareerItemComponent,
    TeamStoreModule,
    HeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    AssessmentStoreModule
  ],
  declarations: [AssessmentPage, TeamsListComponent, UpsertAssessmentComponent]
})
export class AssessmentPageModule {}
