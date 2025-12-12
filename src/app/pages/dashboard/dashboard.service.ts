import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LateCheckoutApiResponse } from './dashboard.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _http = inject(HttpClient);

  getLateGPCheckouts(): Observable<LateCheckoutApiResponse> {
    return this._http.get<LateCheckoutApiResponse>(`${environment.apiUrl}/admin/dashboard/late-gpcheckout`);
  }
}