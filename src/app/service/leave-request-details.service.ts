// src/app/service/leave-request-details.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { APIResponse } from '../models/api-response-models';
import {
  LeaveRequestDataTableArg,
  LeaveRequestListResponse,
  LeaveBalance,
  LeaveStatusUpdateRequest
} from '../models/leave-request-details.models';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/leaves`;

  /**
   * Fetches a paginated list of leave requests.
   * @param request - The data table arguments for pagination and searching.
   * @returns An observable of the API response containing leave requests.
   */
  getLeaveRequests(request: LeaveRequestDataTableArg): Observable<APIResponse<LeaveRequestListResponse>> {
    // return this.http.post<APIResponse<LeaveRequestListResponse>>(`${this.apiUrl}/request-list`, request);
    const mockData: LeaveRequestListResponse = {
      totalRecords: 3,
      data: [
        {
          id: 1, employeeId: 1001, employeeName: 'Nooruddin Md Afsar', startDate: '2025-10-25', endDate: '2025-10-27',
          requestDate: '2025-10-15', leaveDays: 3, leaveDescription: 'Attending family function in hometown.',
          approvalStatus: 'Pending', balance: 12
        },
        {
          id: 2, employeeId: 1002, employeeName: 'Rakesh Mehta', startDate: '2025-11-01', endDate: '2025-11-01',
          requestDate: '2025-10-28', leaveDays: 1, leaveDescription: 'Not feeling well.',
          approvalStatus: 'Approved', balance: 8
        },
        {
          id: 3, employeeId: 1003, employeeName: 'Subhajit Roy', startDate: '2025-11-10', endDate: '2025-11-15',
          requestDate: '2025-11-01', leaveDays: 6, leaveDescription: 'Planned vacation trip.',
          approvalStatus: 'Rejected', balance: 15
        }
      ]
    };
    return of({ success: true, message: 'Fetched Successfully', data: mockData, timestamp: new Date().toISOString() }).pipe(delay(500));
  }

  /**
   * Updates the approval status of a leave request.
   * @param id - The ID of the leave request to update.
   * @param request - The payload with the new approval status.
   * @returns An observable of the API response.
   */
  updateLeaveStatus(id: number, request: LeaveStatusUpdateRequest): Observable<APIResponse<number>> {
    // return this.http.put<APIResponse<number>>(`${this.apiUrl}/approve-leaveStatus/${id}`, request);
    return of({ success: true, message: 'Status updated successfully', data: 1, timestamp: new Date().toISOString() }).pipe(delay(500));
  }

  getLeaveBalance(employeeId: number | undefined): Observable<APIResponse<LeaveBalance[]>> {
    // return this.http.get<APIResponse<LeaveBalance[]>>(`${this.apiUrl}/leave-balance/${employeeId}`);
    const mockBalance: LeaveBalance[] = [
      { leaveType: 'CASUAL', totalBalance: 14, balance: 10 },
      { leaveType: 'EARNED', totalBalance: 30, balance: 25 },
      { leaveType: 'MEDICAL', totalBalance: 10, balance: 8 },
      { leaveType: 'QUARANTINE', totalBalance: 21, balance: 21 },
      { leaveType: 'MATERNITY', totalBalance: 180, balance: 180 }
    ];
    return of({ success: true, message: 'Fetched Successfully', data: mockBalance, timestamp: new Date().toISOString() }).pipe(delay(500));
  }

   /**
   * Fetches  Excel file from API.
   * @returns An observable of the Blob data.
   */
  getLeaveRequestsExcel(request: LeaveRequestDataTableArg): Observable<Blob> {
    // return this.http.post(`${this.apiUrl}/export-excel`, request, { responseType: 'blob' });
    const mockBlob = new Blob(['Mock Excel File Content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return of(mockBlob).pipe(delay(1000));
  }
}
