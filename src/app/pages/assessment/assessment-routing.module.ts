import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AssessmentPage } from './assessment.page'
import { TeamsListComponent } from './teams-list/teams-list.component'

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: AssessmentPage },
      { path: ':career', component: TeamsListComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentPageRoutingModule {}
