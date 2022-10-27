import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { CareersPage } from './careers.page'

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: CareersPage },
      {
        path: ':career',
        loadComponent: () => import('./details/details.component').then(c => c.DetailsComponent)
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DegreesPageRoutingModule {}
