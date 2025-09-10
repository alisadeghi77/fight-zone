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
      {
        path: 'default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component').then((c) => c.TypographyComponent)
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component').then((c) => c.ElementColorComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      }
    ]
  },
  {
    path: 'guest',
    component: GuestComponent,
    children: [
      
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/register/register.component').then((c) => c.RegisterComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
