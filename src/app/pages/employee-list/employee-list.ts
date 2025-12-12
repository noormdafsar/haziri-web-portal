import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pagination } from '../../component/pagination/pagination';
import {
  EmployeeTableListItem,
  DesignationResponse,
  EmployeeDataTableArg,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeDetail,
  RoleResponse,
} from '../../models/employee.models';
import { EmployeeService } from '../../service/employee.service';
import { AlertService } from '../../service/alert.service';

import { ConfirmService } from '../../service/confirm.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { AttendenceDetails } from '../attendence-details/attendence-details';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Pagination, AttendenceDetails],
  templateUrl: './employee-list.html'
})
export class EmployeeList implements OnInit {
  private _fb = inject(FormBuilder);
  private _employeeService = inject(EmployeeService);
  private _alertService = inject(AlertService);
  private _confirmService = inject(ConfirmService);
  private _router = inject(Router);

  // signals
  Employee = signal<EmployeeTableListItem[]>([]);
  designations = signal<DesignationResponse[]>([]);
  roles = signal<RoleResponse[]>([]);
  modalDesignations = signal<DesignationResponse[]>([]);
  allEmployees = signal<EmployeeTableListItem[]>([]);

  // Modal State
  showAttendenceModal = signal<boolean>(false);
  selectedEmployee = signal<EmployeeTableListItem | null>(null);


  // Pagination
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  itemsPerPage = signal<number>(10);
  totalEmployee = signal<number>(0);

  // Filters
  searchQuery = signal<string>('');
  selectedDesignationId = signal<number | null>(null);
  selectedRoleId = signal<number | null>(null);
  selectedStatus = signal<number>(0); // 0: All, 1: Active, 2: Inactive

  // Loading states
  isLoading = signal<boolean>(false);

  // Modal and form
  showEmployeeModal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  userForm: FormGroup;
  isSubmitting = signal<boolean>(false);

  constructor() {
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadDesignations();
    this.loadRoles();
    this.loadEmployees();
  }

  /* -----------------------------
     LOADERS
  ----------------------------- */
  loadDesignations(): void {
    this._employeeService.getDesignations().subscribe({
      next: res => this.designations.set(res.data || []),
      error: (err) => this._alertService.error('Load Failed', err.error?.message || 'Failed to load designations.')
    });
  }

  loadRoles(): void {
    this._employeeService.getRoles().subscribe({
      next: res => this.roles.set(res.data || []),
      error: (err) => this._alertService.error('Load Failed', err.error?.message || 'Failed to load roles.')
    });
  }

  loadEmployees(): void {
    this.isLoading.set(true);

    const search: { [key: string]: string } = {};

    // Add filters to the search object if they have a value
    if (this.searchQuery()) {
      search['searchText'] = this.searchQuery();
    }
    if (this.selectedDesignationId()) {
      search['designationId'] = String(this.selectedDesignationId());
    }
    if (this.selectedRoleId()) {
      // search['userRoleId'] = String(this.selectedRoleId());
    }
    if (this.selectedStatus() > 0) {
      // search['isActive'] = this.selectedStatus() === 1 ? '1' : '0';
    }

    const request: EmployeeDataTableArg = {
      pageNo: this.currentPage(),
      pageLength: this.itemsPerPage(),
      search: Object.keys(search).length > 0 ? search : null,
    };

    this._employeeService.getEmployeeList(request).subscribe({
      next: res => {
        if (res.success && res.data) {
          const employees = res.data.data ?? [];
          this.allEmployees.set(employees);
          this.Employee.set(employees);
          this.totalEmployee.set(res.data.totalRecords);
          this.totalPages.set(Math.ceil(res.data.totalRecords / this.itemsPerPage()));
        } else {
          this.Employee.set([]);
          this.totalEmployee.set(0);
          this.totalPages.set(1);
        }
      },
      error: err => {
        console.error(err);
        this._alertService.error('Load Failed', err.error?.message || 'Could not fetch users from the server.');
      },
      complete: () => this.isLoading.set(false)
    });
  }


  /* -----------------------------
     FORM CREATION
  ----------------------------- */
  private createUserForm(): FormGroup {
    const form = this._fb.group({
      employeeId: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      // userCode: ['', Validators.required],
      userRoleId: ['', Validators.required],
      designationId: ['', Validators.required],
      gender: ['', Validators.required],
      // email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: [''],
      confirmPassword: [''],
      isActive: [1],
    }, { validators: this.passwordMatchValidator });

    return form;
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    // If passwords are empty (like in edit mode unless user types), don't show error
    if (!password && !confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : { mismatch: true };
  }

  private updatePasswordValidator(): void {
    const passwordControl = this.userForm.get('password');
    const confirmPasswordControl = this.userForm.get('confirmPassword');
    if (passwordControl) {
      if (!this.isEditMode()) {
        const validators = [Validators.minLength(6)];

        validators.push(Validators.required);
        passwordControl.setValidators(validators);
        confirmPasswordControl?.setValidators(validators);
      } else {
        passwordControl.clearValidators();
        confirmPasswordControl?.clearValidators();
      }
      passwordControl.updateValueAndValidity();
      confirmPasswordControl?.updateValueAndValidity();
    }
  }

  /* -----------------------------
     SEARCH / FILTER / PAGINATION
  ----------------------------- */
  onSearch(): void {
    this.currentPage.set(1);
    this.loadEmployees();
  }

  onClearSearch(): void {
    this.searchQuery.set('');
    this.selectedDesignationId.set(null);
    this.selectedRoleId.set(null);
    this.selectedStatus.set(0);
    this.currentPage.set(1);
    this.loadEmployees();
  }


  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadEmployees();
  }

  onItemsPerPageChange(size: number): void {
    this.itemsPerPage.set(size);
    this.currentPage.set(1); // Reset to first page
    this.loadEmployees();
  }

  /* -----------------------------
     MODAL / FORM
  ----------------------------- */
  addNewEmployee(): void {
    this.isEditMode.set(false);
    this.userForm.reset({
      id: 0,
      name: '',
      // email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      userRoleId: '',
      designationId: '',
      gender: '',
      isActive: 1 // Default to active
    });
    this.updatePasswordValidator();

    // Set up cascading dropdown for 'Add New' mode
    const roleControl = this.userForm.get('userRoleId');
    const designationControl = this.userForm.get('designationId');
    roleControl?.valueChanges.subscribe(roleId => {
      designationControl?.reset('');
      if (roleId) {
        this._employeeService.getDesignationsByRoleId(Number(roleId)).subscribe(res => {
          this.modalDesignations.set(res.data || []);
        });
      }
    });
    this.showEmployeeModal.set(true);
  }

  editUser(user: EmployeeTableListItem): void {
    console.log(user);
    this.isEditMode.set(true);
    this.showEmployeeModal.set(true);
    this.updatePasswordValidator();

    // 1. Fetch the designations for the user's role.
    this._employeeService.getDesignationsByRoleId(user.employeeRoleId).subscribe(res => {
      // 2. Populate the list of available designations for the modal dropdown.
      this.modalDesignations.set(res.data || []);

      // 3. Patch the form *after* the designations are loaded and the UI has had a chance to update.
      // The setTimeout ensures that Angular renders the <option>s before we try to select one.
        this.userForm.patchValue({ ...user, password: '', confirmPassword: '' });
    });
  }

  closeUserModal(): void {
    this.showEmployeeModal.set(false);
    this.isEditMode.set(false);
    this.userForm.reset();
    this.isSubmitting.set(false); // Reset submitting state on close
  }

  /* -----------------------------
     CREATE / UPDATE / DELETE
  ----------------------------- */
  submitUserForm(): void {
    if (!this.userForm.valid) {
      this.userForm.markAllAsTouched();
      this._alertService.warning('Invalid Form', 'Please fill all required fields correctly.');
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.userForm.value;

    const requestData: CreateEmployeeRequest | UpdateEmployeeRequest = {
      name: formValue.name,
      phone: formValue.phone,
      // email: formValue.email,
      isActive: formValue.isActive ? 1 : 0,
      gender: formValue.gender,
      designationId: +formValue.designationId,
      employeeRoleId: +formValue.userRoleId,
      password: formValue.password || undefined
    };

    console.log(formValue);

    if (this.isEditMode()) {
      this._employeeService.updateEmployee(formValue.employeeId, requestData as UpdateEmployeeRequest).subscribe({
        next: () => {
          this._alertService.success('Success', 'User updated successfully.');
          this.closeUserModal();
          this.loadEmployees();
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this._alertService.error('Update Failed', err.error?.message || 'Failed to update the user.');
        }
      });
    } else {
      this._employeeService.createEmployee(requestData as CreateEmployeeRequest).subscribe({
        next: () => {
          this._alertService.success('Success', 'User created successfully.');
          this.closeUserModal();
          this.currentPage.set(1); // Go back to the first page
          this.loadEmployees(); // Reload to see the new user
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this._alertService.error('Creation Failed', err.error?.message || 'Failed to create the new user.');
        }
      });
    }
  }

  deleteUser(user: EmployeeTableListItem): void {
    this._confirmService.show(
      'Delete User',
      `Are you sure you want to delete the user "${user.name}"? This action cannot be undone.`,
      'Delete', 'Cancel', 'danger'
    ).pipe(take(1)).subscribe(confirmed => {
      if (confirmed) {
        this._employeeService.deleteEmployee(user.employeeId).subscribe({
          next: () => {
            this._alertService.success('Deleted', `User "${user.name}" has been deleted.`);
            this.loadEmployees();
          },
          error: (err) => this._alertService.error('Delete Failed',err.error?.message || 'Failed to delete the user.')
        });
      }
    });
  }

  /* -----------------------------
     HELPERS
  ----------------------------- */
  getStatusClass(isActive: boolean): string {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  attendenceDetails(user: EmployeeTableListItem) {
    this.selectedEmployee.set(user);
    this.showAttendenceModal.set(true);
  }

  closeAttendenceModal() {
    this.showAttendenceModal.set(false);
    this.selectedEmployee.set(null);
  }
}
