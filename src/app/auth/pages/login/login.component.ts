// angular import
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthHttpService } from '../../../shared/http-services/auth-http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { LoginRequestDto, VerifyOtpRequestDto } from '../../../shared/models/auth.models';

@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  phoneNumber: string = '';
  otp: string = '';
  isOtpSent: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authHttpService: AuthHttpService,
    private authService: AuthService,
    private router: Router
  ) { }

  private isValidPersianPhoneNumber(phone: string): boolean {
    const persianPhoneRegex = /^09\d{9}$/;
    return persianPhoneRegex.test(phone);
  }

  onPhoneNumberInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    this.phoneNumber = value;
    this.errorMessage = '';
  }

  onOtpInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4);
    }
    this.otp = value;
    this.errorMessage = '';
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.isLoading = true;

    try {
      if (!this.isOtpSent) {
        if (!this.isValidPersianPhoneNumber(this.phoneNumber)) {
          this.errorMessage = 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد';
          return;
        }

        const loginRequest: LoginRequestDto = {
          phoneNumber: this.phoneNumber
        };

        this.authHttpService.login(loginRequest).subscribe(() => {
          this.isOtpSent = true;
        })
      } else {

        const verifyRequest: VerifyOtpRequestDto = {
          phoneNumber: this.phoneNumber,
          otpCode: this.otp
        };

        this.authHttpService.verify(verifyRequest).subscribe((response) => {
          if (response?.data?.token) {
            this.authService.login(response.data.token, { userName: response.data.userName, fullName: response.data.fullName });
            this.router.navigate(['/management']);
          } else {

            this.errorMessage = response?.errorMessages[0] || 'کد تأیید نامعتبر است';
          }
        });
      }
    } catch (error) {
      this.errorMessage = 'خطا در ارتباط با سرور';
      console.error('Login error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getButtonText(): string {
    return this.isOtpSent ? 'تایید' : 'ارسال کد';
  }
}
