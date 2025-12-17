import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { APIResponse } from '../models/api-response-models';
import {
  CreateEmployeeRequest,
  DesignationResponse,
  RoleResponse,
  UpdateEmployeeRequest,
  EmployeeDataTableArg,
  EmployeeDetail,
  EmployeeListResponse,
  EmployeeTableListItem
} from '../models/employee.models';
import { EmployeeProfile, UpdateProfile } from '../models/auth.models';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/employees`;

  /**
   * Get a paginated and filtered list of employees.
   */
  getEmployeeList(request: EmployeeDataTableArg): Observable<APIResponse<EmployeeListResponse>> {
    // return this.http.post<APIResponse<EmployeeListResponse>>(`${this.apiUrl}/list`, request);
    const mockData: EmployeeListResponse = {
      totalRecords: 15,
      data: [
        {
          id: 1, employeeId: 1001, name: 'Rakesh Mehta', phone: '7980639653', gender: 'Male', password: 'password',
          employeeRoleId: 2, employeeRoleName: 'Employee', designationId: 1, designationName: 'CTO(Chief Technical Officer)', isActive: 1
        },
        {
          id: 2, employeeId: 1006, name: 'Nooruddin Md Afsar', phone: '8797905664', gender: 'Male', password: 'password',
          employeeRoleId: 1, employeeRoleName: 'Admin', designationId: 2, designationName: 'Software Engineer', isActive: 1
        },
        {
          id: 6, employeeId: 1002, name: 'Subhajit Roy', phone: '1234567890', gender: 'Male', password: 'password',
          employeeRoleId: 5, employeeRoleName: 'Employee', designationId: 5, designationName: 'Senior Software Engineer', isActive: 1
        },
        {
          id: 3, employeeId: 1003, name: 'Sourin Chaterjee', phone: '6297260227', gender: 'Male', password: 'password',
          employeeRoleId: 3, employeeRoleName: 'Employee', designationId: 3, designationName: 'Software Engineer', isActive: 1
        },
        {
          id: 7, employeeId: 1007, name: 'Tapabrata Mukherjee', phone: '6297260227', gender: 'Male', password: 'password',
          employeeRoleId: 3, employeeRoleName: 'Employee', designationId: 3, designationName: 'Software Engineer', isActive: 1
        },
        {
          id: 4, employeeId: 1004, name: 'Disha', phone: '7439151313', gender: 'Female', password: 'password',
          employeeRoleId: 4, employeeRoleName: 'Employee', designationId: 4, designationName: 'Back Office', isActive: 1
        },
        {
          id: 5, employeeId: 1005, name: 'Gouri', phone: '8582928200', gender: 'Fem ale', password: 'password',
          employeeRoleId: 5, employeeRoleName: 'Employee', designationId: 5, designationName: 'HR Manager', isActive: 0
        }
      ]
    };
    return of({ success: true, message: 'Fetched Successfully', data: mockData, timestamp: new Date().toISOString() }).pipe(delay(500));
  }

  /**
   * Get a single employee's details by ID.
   */
  getEmployee(id: number): Observable<APIResponse<EmployeeDetail>> {
    // return this.http.get<APIResponse<EmployeeDetail>>(`${this.apiUrl}/${id}`);
    const mockData: EmployeeDetail = {
      id: id,
      employeeId: 1001,
      name: 'Amit Sharma',
      employeeCode: 'EMP001',
      phone: '9876543210',
      gender: 'Male',
      designationId: 1,
      employeeRoleId: 2,
      isActive: 1
    };
    return of({ success: true, message: 'Fetched Successfully', data: mockData, timestamp: new Date().toISOString() }).pipe(delay(300));
  }

  // getDesignationList(id: number): Observable<APIResponse<DesignationResponse[]>> {
  //   return this.http.get<APIResponse<DesignationResponse[]>>(`${this.apiUrl}/get-designation/${id}`);
  // }


  /**
   * Create a new employee.
   */
  createEmployee(request: CreateEmployeeRequest): Observable<APIResponse> {
    // return this.http.post<APIResponse>(`${this.apiUrl}/create`, request);
    return of({ success: true, message: 'Employee created successfully', data: null, timestamp: new Date().toISOString() }).pipe(delay(500));
  }

  /**
   * Update an existing employee.
   */
  updateEmployee(employeeId: number, request: UpdateEmployeeRequest): Observable<APIResponse> {
    // return this.http.put<APIResponse>(`${this.apiUrl}/${employeeId}/update`, request);
    return of({ success: true, message: 'Employee updated successfully', data: null, timestamp: new Date().toISOString() }).pipe(delay(500));
  }

  /**
   * Delete a employee by ID.
   */
  deleteEmployee(id: number): Observable<APIResponse> {
    // return this.http.delete<APIResponse>(`${this.apiUrl}/${id}/delete`);
    return of({ success: true, message: 'Employee deleted successfully', data: null, timestamp: new Date().toISOString() }).pipe(delay(500));
  }

  /**
   * Get all available designations.
   */
  getDesignationsByRoleId(roleId: number): Observable<APIResponse<DesignationResponse[]>> {
    // return this.http.get<APIResponse<DesignationResponse[]>>(`${this.apiUrl}/get-designation/${roleId}`);
    const mockData: DesignationResponse[] = [
      { id: 1, name: 'Software Engineer' },
      { id: 2, name: 'HR Manager' },
      { id: 3, name: 'Accountant' },
      { id: 4, name: 'Team Lead' }
    ];
    return of({ success: true, message: 'Fetched Successfully', data: mockData, timestamp: new Date().toISOString() }).pipe(delay(300));
  }

  /**
     * Fetches all available designation.
     */
  getDesignations(): Observable<APIResponse<DesignationResponse[]>> {
    // return this.http.get<APIResponse<DesignationResponse[]>>(`${this.apiUrl}/get-designations`);
    const mockData: DesignationResponse[] = [
      { id: 1, name: 'Software Engineer' },
      { id: 2, name: 'HR Manager' },
      { id: 3, name: 'Accountant' },
      { id: 4, name: 'Team Lead' }
    ];
    return of({ success: true, message: 'Fetched Successfully', data: mockData, timestamp: new Date().toISOString() }).pipe(delay(300));
  }

  /**
   * Get all available roles.
   */
  getRoles(): Observable<APIResponse<RoleResponse[]>> {
    // return this.http.get<APIResponse<RoleResponse[]>>(`${this.apiUrl}/get-roles`);
    const mockData: RoleResponse[] = [
      { id: 1, roleName: 'Admin' },
      { id: 2, roleName: 'Employee' }
    ];
    return of({ success: true, message: 'Fetched Successfully', data: mockData, timestamp: new Date().toISOString() }).pipe(delay(300));
  }

  /**
   * Get all Employees for dropdowns.
   */
  getAllEmployees(): Observable<APIResponse<EmployeeTableListItem[]>> {
    // return this.http.get<APIResponse<EmployeeTableListItem[]>>(`${this.apiUrl}/all-list`);
    // Returning empty array or minimal mock for dropdowns
    return of({ success: true, message: 'Fetched Successfully', data: [], timestamp: new Date().toISOString() }).pipe(delay(300));
  }

  /**
   * Get current employee's profile.
   */
  getAdminProfile(): Observable<APIResponse<EmployeeProfile>> {
    // return this.http.get<APIResponse<EmployeeProfile>>(`${this.apiUrl}/profile`);
    // Mocking as 'any' because EmployeeProfile interface is not fully visible in context, 
    // but this ensures the UI gets something.
    const mockProfile: any = {
      id: 1,
      name: 'Super Admin',
      email: 'admin@haziri.com',
      phone: '9999999999',
      role: 'Administrator',
      designation: 'System Admin'
    };
    return of({ success: true, message: 'Fetched Successfully', data: mockProfile, timestamp: new Date().toISOString() }).pipe(delay(300));
  }

  /**
   * Update current employee's profile.
   */
  updateProfile(request: UpdateProfile): Observable<APIResponse<boolean>> {
    // return this.http.put<APIResponse<boolean>>(`${this.apiUrl}/update-profile`, request);
    return of({ success: true, message: 'Profile updated successfully', data: true, timestamp: new Date().toISOString() }).pipe(delay(500));
  }
}