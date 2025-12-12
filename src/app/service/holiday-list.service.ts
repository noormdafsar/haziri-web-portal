import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { HolidayDTO } from '../models/holiday-list.model';
import { APIResponse } from '../models/api-response-models';

@Injectable({
    providedIn: 'root'
})
export class HolidayService {
    private _http = inject(HttpClient);
    private _apiUrl = `${environment.apiUrl}/admin/holidays`;

    getAllHolidays(): Observable<APIResponse<HolidayDTO[]>> {
        return this._http.get<APIResponse<HolidayDTO[]>>(`${this._apiUrl}/list`);
    }

    createHoliday(holiday: { holidayName: string, holidayDate: string }): Observable<APIResponse<number>> {
        return this._http.post<APIResponse<number>>(`${this._apiUrl}/create`, holiday);
    }

    updateHoliday(id: number, holiday: { holidayName: string, holidayDate: string }): Observable<APIResponse<boolean>> {
        return this._http.put<APIResponse<boolean>>(`${this._apiUrl}/update/${id}`, holiday);
    }

    deleteHoliday(id: number): Observable<APIResponse<boolean>> {
        return this._http.delete<APIResponse<boolean>>(`${this._apiUrl}/delete/${id}`);
    }
}
