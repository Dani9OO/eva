import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { TeamPage } from './team.page'

const routes: Routes = [
  {
    path: '',
    component: TeamPage
  },
  {
    path: 'upsert',
    loadComponent: () => import('./upsert-team/upsert-team.component').then(c => c.UpsertTeamComponent)
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamPageRoutingModule {}
