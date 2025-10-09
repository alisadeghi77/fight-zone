import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebLayoutComponent } from './layout/web-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { OtpLoginComponent } from './pages/otp-login/otp-login.component';
import { CompetitionDetailComponent } from './pages/competition-detail/competition-detail.component';

const routes: Routes = [
  {
    path: '',
    component: WebLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'competition/:id',
        component: CompetitionDetailComponent
      }
    ]
  },
  {
    path: 'otp-login',
    component: OtpLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebRoutingModule { }
