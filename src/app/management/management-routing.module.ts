import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home-component/home-component';
import { ManagementLayoutComponent } from './shared/management-layout/management-layout-component';
import { CompetitionsComponent } from './pages/competitions/competitions-component/competitions-component';
import { CompetitionInsertUpdate } from './pages/competitions/competition-insert-update/competition-insert-update';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ManagementLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'competitions',
        component: CompetitionsComponent
      },
      { path: 'competitions/new', component: CompetitionInsertUpdate },
      { path: 'competitions/edit/:id', component: CompetitionInsertUpdate },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
