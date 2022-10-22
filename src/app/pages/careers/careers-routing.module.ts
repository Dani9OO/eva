import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { CareersPage } from './careers.page'
import { ArchivedComponent } from './archived/archived.component'

const routes: Routes = [
  {
    path: '',
    component: CareersPage
  },
  {
    path: 'archived',
    component: ArchivedComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DegreesPageRoutingModule {}
