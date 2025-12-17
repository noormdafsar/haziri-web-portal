import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LateArrival, LateCheckoutApiResponse, LateEmployeeSummary, PendingLeaveResponse } from '../models/dashboard.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { APIResponse } from '../models/api-response-models';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _http = inject(HttpClient);

  getForgetCheckInOuts(): Observable<LateCheckoutApiResponse> {
    // return this._http.get<LateCheckoutApiResponse>(`${environment.apiUrl}/admin/dashboard/late-gpcheckout`);

    const mockData = {
      Data: [
        { userId: '1001', userName: 'Noor', checkInTime: '09:30 AM', checkOutTime: null },
        { userId: '1002', userName: 'Tapabrata', checkInTime: null, checkOutTime: '06:30 PM' },
        { userId: '1003', userName: 'Subhajit', checkInTime: '10:00 AM', checkOutTime: null }
      ],
      Count: 3
    };

    return of({
      success: true, message: 'Fetched Successfully', data: mockData, timestamp: new Date().toISOString()
    }).pipe(delay(500));
  }

  getPendingLeaves(): Observable<APIResponse<PendingLeaveResponse>> {
    // Mock data for pending leaves
    const mockData: PendingLeaveResponse = {
      totalRecords: 5,
      data: [
        { id: 1, userName: 'Rakesh Mehta', startDate: '2025-11-10', endDate: '2025-11-12', leaveDays: 3, approvalStatus: 'Pending' },
        { id: 2, userName: 'Subhajit Roy', startDate: '2025-11-15', endDate: '2025-11-15', leaveDays: 1, approvalStatus: 'Pending' },
        { id: 3, userName: 'Tapabrata Mukherjee', startDate: '2025-12-01', endDate: '2025-12-05', leaveDays: 5, approvalStatus: 'Pending' },
        { id: 4, userName: 'Sourin Chaterjee', startDate: '2025-12-10', endDate: '2025-12-11', leaveDays: 2, approvalStatus: 'Pending' },
        { id: 5, userName: 'Imran Mondal', startDate: '2025-12-20', endDate: '2025-12-22', leaveDays: 3, approvalStatus: 'Pending' }
      ]
    };

    return of({
      success: true, message: 'Fetched Successfully', data: mockData, timestamp: new Date().toISOString()
    }).pipe(delay(500));
  }

  getMonthlyLateReport(): Observable<APIResponse<LateEmployeeSummary[]>> {
    // Mock data for employees late (> 10:30 AM) in the current month
    const mockData: LateEmployeeSummary[] = [
      { employeeId: '1001', name: 'Rakesh Mehta', designation: 'CTO', totalLateDays: 5, averageLateDuration: '15 mins' },
      { employeeId: '1002', name: 'Subhajit Roy', designation: 'Senior Software Engineer', totalLateDays: 3, averageLateDuration: '10 mins' },
      { employeeId: '1003', name: 'Sourin Chaterjee', designation: 'Software Engineer', totalLateDays: 8, averageLateDuration: '45 mins' },
      { employeeId: '1004', name: 'Disha', designation: 'Back Office', totalLateDays: 1, averageLateDuration: '5 mins' },
    ];

    return of({
      success: true, message: 'Fetched Successfully', data: mockData, timestamp: new Date().toISOString()
    }).pipe(delay(500));
  }

  getLateArrivals(): Observable<APIResponse<{ data: LateArrival[], count: number }>> {
    // Mock data for late arrivals (after 10:30 AM)
    const mockData: LateArrival[] = [
      { employeeId: '1001', name: 'Rakesh Mehta', date: '2025-11-02', checkInTime: '10:45 AM' },
      { employeeId: '1003', name: 'Sourin Chaterjee', date: '2025-11-05', checkInTime: '11:00 AM' },
      { employeeId: '1001', name: 'Rakesh Mehta', date: '2025-11-10', checkInTime: '10:55 AM' },
      { employeeId: '1002', name: 'Subhajit Roy', date: '2025-11-12', checkInTime: '10:35 AM' },
      { employeeId: '1004', name: 'Disha', date: '2025-11-15', checkInTime: '11:15 AM' }
    ];

    return of({
      success: true, message: 'Fetched Successfully', data: { data: mockData, count: mockData.length }, timestamp: new Date().toISOString()
    }).pipe(delay(500));
  }
}