import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { ManagementLayoutComponent } from './management/shared/management-layout/management-layout-component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./web/web-module').then(m => m.WebModule)
  },
  {
    path: 'management',
    loadChildren: () => import('./management/management-module').then(m => m.ManagementModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    component: ManagementLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/admin/default',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
