import { CareerGuard } from '@guards/career'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { RubricsPage } from './rubrics.page'

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: RubricsPage },
      {
        path: ':career',
        loadComponent: () => import('../../components/rubrics/rubrics.component').then(c => c.RubricsComponent),
        canActivate: [CareerGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubricsPageRoutingModule {}
