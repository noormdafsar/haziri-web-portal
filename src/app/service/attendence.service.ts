import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { APIResponse, } from '../models/api-response-models';
import { EmployeeDataTableArg } from '../models/employee.models';
import { AttendanceDataTable, AttendanceDTO } from '../models/attendence.models';

@Injectable({
  providedIn: 'root'
})
export class AttendenceService {
  private _http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/admin/attandance';

  getAttendanceList(userId: number, request: EmployeeDataTableArg): Observable<APIResponse<AttendanceDataTable>> {
    // return this._http.post<APIResponse<AttendanceDataTable>>(`${this.baseUrl}/list/${userId}`, request);

    const mockData: AttendanceDTO[] = [
      {
        userId: userId,
        userName: 'Rakesh Mehta',
        attendanceInDateTime: new Date().toISOString(),
        attendanceOutDateTime: null,
        latitude: 22.5726,
        longitude: 88.3639
      },
      {
        userId: userId,
        userName: 'Rakesh Mehta',
        attendanceInDateTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        attendanceOutDateTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        latitude: 22.5726,
        longitude: 88.3639
      },
      {
        userId: userId,
        userName: 'Rakesh Mehta',
        attendanceInDateTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        attendanceOutDateTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        latitude: 22.5726,
        longitude: 88.3639
      }
    ];

    return of({
      success: true,
      message: 'Fetched Successfully',
      data: {
        data: mockData,
        totalRecords: 30
      },
      timestamp: new Date().toISOString()
    }).pipe(delay(500));
  }

  getAttendenceListExcel(userId: number, request: EmployeeDataTableArg): Observable<Blob> {
    // return this._http.post(`${this.baseUrl}/export-excel/${userId}`, request, {
    //   responseType: 'blob'
    // });
    return of(new Blob(['Mock Excel File'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })).pipe(delay(500));
  }

}