import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    AuthRoutingModule,
    LoginComponent
  ]
})
export class AuthModule { }
