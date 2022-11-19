import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { AdminGuard } from '@guards/admin'
import { AlumniGuard } from '@guards/alumni'
import { AppGuard } from '@guards/app'
import { ProfessorGuard } from '@guards/professor'

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
    canActivate: [AppGuard, AdminGuard]
  },
  {
    path: 'careers',
    loadChildren: () => import('./pages/careers/careers.module').then(m => m.DegreesPageModule),
    canActivate: [AppGuard, AdminGuard]
  },
  {
    path: 'directory',
    loadChildren: () => import('./pages/directory/directory.module').then(m => m.DirectoryPageModule),
    canActivate: [AppGuard, AdminGuard]
  },
  {
    path: 'summary',
    loadChildren: () => import('./pages/summary/summary.module').then(m => m.SummaryPageModule),
    canActivate: [AppGuard, AdminGuard]
  },
  {
    path: 'team',
    loadChildren: () => import('./pages/team/team.module').then(m => m.TeamPageModule),
    canActivate: [AppGuard, AlumniGuard]
  },
  {
    path: 'assessment',
    loadChildren: () => import('./pages/assessment/assessment.module').then(m => m.AssessmentPageModule),
    canActivate: [AppGuard, ProfessorGuard]
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
