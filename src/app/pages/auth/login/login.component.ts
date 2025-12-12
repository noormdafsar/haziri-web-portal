import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { LoginRequest } from '../../../models/auth.models';
import { LoggerService } from '../../../service/logger.service';
import { AlertService } from '../../../service/alert.service';
import { AlertComponent } from '../../../component/alert/alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData: LoginRequest = {
    phone: '',
    password: '',
  };

  isLoading = false;
  showPassword = false;

  private _logger = inject(LoggerService).createChild('LoginComponent');
  private _alertService = inject(AlertService);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  constructor(

  ) {}

  ngOnInit(): void {
    // Check if user is already logged in
    if (this._authService.isLoggedIn()) {
      this._router.navigate(['/dashboard']);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;

    // Basic validation
    if (!this.loginData.phone || !this.loginData.password) {
      this._alertService.error('Validation Error', 'Please fill in all fields');
      this.isLoading = false;
      return;
    }

    // Call the auth service login method
    this._authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Handle API response success flag
        if (response?.success && response.data) {
          this._router.navigate(['/dashboard']);
          return;
        }

        // Show error from API if available
        const msg = response?.message ?? 'Invalid phone number or password';
        this._alertService.error('Login Failed', msg);
        this._logger.warn('Login attempt unsuccessful', response);
      },
      error: (error) => {
        this.isLoading = false;
        // Handle different error types
        if (error.status === 401) {
          this._alertService.error('Login Failed', 'Invalid phone number or password');
        } else if (error.status === 429) {
          this._alertService.error('Too Many Attempts', 'Too many failed attempts. Please try again later.');
        } else if (error.error?.message) {
          this._alertService.error('Login Error', error.error.message);
        } else {
          this._alertService.error('Login Error', 'An error occurred during login. Please try again.');
        }
        this._logger.error('Login failed', error);
      }
    });
  }

  onForgotPassword(): void {
    // Handle forgot password logic
    console.log('Forgot password clicked');
  }
}