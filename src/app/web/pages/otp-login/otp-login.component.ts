import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.scss']
})
export class OtpLoginComponent {
  phoneNumber = '';
  otpCode = '';
  step: 'phone' | 'otp' = 'phone';
  isLoading = false;

  constructor(private router: Router) {}

  sendOtp() {
    if (this.phoneNumber && this.phoneNumber.length === 11) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        this.step = 'otp';
        this.isLoading = false;
      }, 2000);
    }
  }

  verifyOtp() {
    if (this.otpCode && this.otpCode.length === 5) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        this.router.navigate(['/']);
        this.isLoading = false;
      }, 2000);
    }
  }

  goBack() {
    this.step = 'phone';
    this.otpCode = '';
  }

  formatPhoneNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    this.phoneNumber = value;
  }

  formatOtpCode(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.substring(0, 5);
    }
    this.otpCode = value;
  }
}
