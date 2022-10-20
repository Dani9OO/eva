import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { AppGuard } from './services/app/app.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'summary',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then(m => m.CalendarPageModule),
    canActivate: [AppGuard]
  },
  {
    path: 'careers',
    loadChildren: () => import('./pages/careers/careers.module').then(m => m.DegreesPageModule),
    canActivate: [AppGuard]
  },
  {
    path: 'directory',
    loadChildren: () => import('./pages/directory/directory.module').then(m => m.DirectoryPageModule),
    canActivate: [AppGuard]
  },
  {
    path: 'rubrics',
    loadChildren: () => import('./pages/rubrics/rubrics.module').then(m => m.RubricsPageModule),
    canActivate: [AppGuard]
  },
  {
    path: 'summary',
    loadChildren: () => import('./pages/summary/summary.module').then(m => m.SummaryPageModule),
    canActivate: [AppGuard]
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
