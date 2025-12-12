import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { UpdateProfile, EmployeeInfo } from '../../models/auth.models';
import { Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../service/employee.service';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(EmployeeService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  public user: Signal<EmployeeInfo | null>;
  public profileForm: FormGroup;
  public isEditing = signal(false);
  public isLoading = signal(false);

  constructor() {
    this.user = this.authService.currentUser;
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: [''],
      confirmPassword: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.profileForm.patchValue(this.user() || {});
  }

  toggleEdit(): void {
    this.isEditing.set(!this.isEditing());
    if (!this.isEditing()) {
      this.profileForm.reset(this.user() || {});
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.alertService.error('Invalid Form', 'Please check the fields and try again.');
      return;
    }

    this.isLoading.set(true);
    const formValue = this.profileForm.value;
    const request: UpdateProfile = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password || undefined
    };

    this.userService.updateProfile(request).subscribe({
      next: (res) => {
        if (res.success) {
          this.alertService.success('Success', 'Profile updated successfully.');
          this.authService.refreshCurrentUser().subscribe(() => {
            this.isEditing.set(false);
            this.isLoading.set(false);
          });
        } else {
          this.alertService.error('Update Failed', res.message || 'Could not update profile.');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.alertService.error('Server Error',err.error?.message || 'An error occurred while updating your profile.');
        console.error(err);
      }
    });
  }
}