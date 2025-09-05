import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home-component/home-component';
import { ManagementLayoutComponent } from './shared/management-layout/management-layout-component';
import { CompetitionsComponent } from './pages/competitions/competitions-component/competitions-component';

const routes: Routes = [
  {
    path: '',
    component: ManagementLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'competitions',
        component: CompetitionsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
