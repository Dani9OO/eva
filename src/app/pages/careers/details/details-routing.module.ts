import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DetailsPage } from './details.page'

const routes: Routes = [
  {
    path: '',
    component: DetailsPage,
    children: [
      { path: '', loadComponent: () => import('./menu/menu.component').then(c => c.MenuComponent) },
      { path: 'rubrics', loadComponent: () => import('../../../components/rubrics/rubrics.component').then(c => c.RubricsComponent) }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsPageRoutingModule {}
