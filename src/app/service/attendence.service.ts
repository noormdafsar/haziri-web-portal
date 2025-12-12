import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { APIResponse, } from '../models/api-response-models';
import { EmployeeDataTableArg } from '../models/employee.models';
import { AttendanceDataTable } from '../models/attendence.models';

@Injectable({
  providedIn: 'root'
})
export class AttendenceService {
  private _http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/admin/attandance';

  getAttendanceList(userId: number, request: EmployeeDataTableArg): Observable<APIResponse<AttendanceDataTable>> {
    return this._http.post<APIResponse<AttendanceDataTable>>(`${this.baseUrl}/list/${userId}`, request);
  }

  getAttendenceListExcel(userId: number, request: EmployeeDataTableArg): Observable<Blob> {
    return this._http.post(`${this.baseUrl}/export-excel/${userId}`, request, {
      responseType: 'blob'
    });
  }

}