import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environment/environment';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  KeyExchangeResponse,
  EmployeeInfo
} from '../models/auth.models';
import { APIResponse } from '../models/api-response-models';
import { LoggerService } from './logger.service';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);
  private _logger = inject(LoggerService).createChild('AuthService');

  // Reactive state management
  private _currentUserSubject = new BehaviorSubject<EmployeeInfo | null>(null);
  public currentUser$ = this._currentUserSubject.asObservable();
  // Temporary development toggle: set to true to bypass authentication and redirect to dashboard.
  public bypassLogin = true;

  // Modern signal-based state
  public isAuthenticated = signal<boolean>(false);
  public currentUser = signal<EmployeeInfo | null>(null);

  private readonly apiUrl = environment.apiUrl + '/auth';
  private readonly storageKeys = {
    accessToken: 'mrs_admin_access_token',
    refreshToken: 'mrs_admin_refresh_token',
    user: 'mrs_admin_user',
    expiresAt: 'mrs_admin_expires_at'
  };
  private _router = inject(Router);
  private _userService = inject(EmployeeService);

  constructor() {
    this.loadStoredAuth();
  }

  /**
   * Login with phone number and password
   */
  login(request: LoginRequest): Observable<APIResponse<LoginResponse>> {
    return this._http.post<APIResponse<LoginResponse>>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.storeAuthData(response.data);
            this.setCurrentUser(response.data.employee);
            // Redirect after successfull login
            // this.router.navigate(['/dashboard']);
          }
        }),
        catchError(error => {
          this._logger.error('Login failed', error);
          // return of(error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout and clear stored data
   */
  logout(): Observable<APIResponse<void>> {
    return this._http.post<APIResponse<void>>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(response => {
          if (response.success) {
            this.clearAuthData();
            this._router.navigate(['/login']);
          }
        }),
        catchError(error => {
          // Even if the API call fails, clear local data
          this.clearAuthData();
          this._router.navigate(['/login']);
          return of({ success: true, data: null, message: 'Logged out locally', timestamp: moment().toISOString() });
        })
      );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<APIResponse<LoginResponse>> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    // Some backends accept only refreshToken; include accessToken if present.
    const request: RefreshTokenRequest = {
      accessToken: accessToken ?? '',
      refreshToken
    };

    return this._http.post<APIResponse<LoginResponse>>(`${this.apiUrl}/refresh-token`, request)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.storeAuthData(response.data);
            this.setCurrentUser(response.data.employee);
          }
        }),
        catchError(error => {
          this._logger.error('Token refresh failed', error);
          this.clearAuthData();
          return throwError(() => error);
        })
      );
  }

  /**
   * Get encryption keys from server
   */
  //   getEncryptionKeys(): Observable<APIResponse<KeyExchangeResponse>> {
  //     return this.http.get<APIResponse<KeyExchangeResponse>>(`${this.apiUrl}/get-encryption-keys`)
  //       .pipe(
  //         catchError(error => {
  //           this.logger.error('Failed to get encryption keys', error);
  //           return throwError(() => error);
  //         })
  //       );
  //   }

  /**
   * Validate current token
   */
  validateToken(): Observable<APIResponse<any>> {
    return this._http.get<APIResponse<any>>(`${this.apiUrl}/validate-token`)
      .pipe(
        catchError(error => {
          this._logger.error('Token validation failed', error);
          this.clearAuthData();
          return throwError(() => error);
        })
      );
  }

  /**
   * Check if user is currently authenticated
   */
  // isLoggedIn(): boolean {
  //   const token = this.getAccessToken();
  //   const expiresAt = this.getTokenExpiry();

  //   console.log(token);
  //   console.log(expiresAt);

  //   if (!token || !expiresAt) {
  //     return false;
  //   }

  //   return moment().isBefore(moment(expiresAt));
  // }

  isLoggedIn(): boolean {
    // If bypassLogin is enabled, pretend the user is logged in.
    if (this.bypassLogin) {
      // Ensure there's a minimal current user so UI components that read user fields don't crash.
      if (!this.currentUser()) {
        const devUser: EmployeeInfo = {
          empoyeeId: 0,
          name: 'Dev User',
          email: 'dev@example.com',
          phone: '',
          isActive: true,
          designationId: 0,
          designationName: 'Developer',
          hasAttendance: false,
          gender: null
        };
        this.setCurrentUser(devUser);
      }
      this.isAuthenticated.set(true);
      return true;
    }

    // Original logic
    const token = this.getAccessToken();
    const expiresAt = this.getTokenExpiry();

    if (!token || !expiresAt) {
      return false;
    }

    return moment().isBefore(moment(expiresAt));
  }
  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.storageKeys.accessToken);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.storageKeys.refreshToken);
  }

  /**
   * Get current user info
   */
  getCurrentUser(): EmployeeInfo | null {
    return this.currentUser();
  }

  /**
   * Store authentication data in localStorage
   */
  private storeAuthData(response: LoginResponse): void {
    localStorage.setItem(this.storageKeys.accessToken, response.accessToken);
    localStorage.setItem(this.storageKeys.refreshToken, response.refreshToken);
    localStorage.setItem(this.storageKeys.user, JSON.stringify(response.employee));
    localStorage.setItem(this.storageKeys.expiresAt, response.expiresAt);
  }

  /**
   * Set current user and update reactive state
   */
  private setCurrentUser(user: EmployeeInfo): void {
    this.currentUser.set(user);
    this._currentUserSubject.next(user);
    this.isAuthenticated.set(true);
  }

  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    console.trace("In clearAuthData");
    Object.values(this.storageKeys).forEach(key => {
      localStorage.removeItem(key);
    });

    this.currentUser.set(null);
    this._currentUserSubject.next(null);
    this.isAuthenticated.set(false);
  }

  /**
   * Load stored authentication data on service initialization
   */
  private loadStoredAuth(): void {
    const userJson = localStorage.getItem(this.storageKeys.user);
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const expiresAt = this.getTokenExpiry();

    if (!userJson) {
      // nothing to restore
      this.clearAuthData();
      return;
    }

    try {
      const user: EmployeeInfo = JSON.parse(userJson);
      // restore user into signals/subjects so UI and interceptors can act
      this.currentUser.set(user);
      this._currentUserSubject.next(user);

      // Mark authenticated only if access token is present and not expired.
      // If access token is expired but refresh token exists, keep data so refresh can run.
      if (accessToken && expiresAt && moment().isBefore(moment(expiresAt))) {
        this.isAuthenticated.set(true);
      } else {
        this.isAuthenticated.set(false);
      }
    } catch (error) {
      this._logger.error('Failed to parse stored user data', error);
      this.clearAuthData();
    }
  }

  /**
   * Get token expiry date
   */
  private getTokenExpiry(): string | null {
    return localStorage.getItem(this.storageKeys.expiresAt);
  }

  /**
   * Generate unique client ID
   */
  //   private generateClientId(): string {
  //     return CryptoJS.lib.WordArray.random(16).toString();
  //   }

  /**
   * Check if token is close to expiry (within 5 minutes)
   */
  isTokenNearExpiry(): boolean {
    const expiresAt = this.getTokenExpiry();
    if (!expiresAt) return true;

    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = moment().valueOf();
    const fiveMinutes = 5 * 60 * 1000;

    return (expiryTime - currentTime) < fiveMinutes;
  }

  /**
   * Get user roles
   */
  getUserRoles(): string[] {
    const user = this.getCurrentUser();
    return user?.roleName ? [user.roleName] : [];
  }

  /**
   * Check if user has specific role
   */
  //   hasRole(role: string): boolean {
  //     return this.getUserRoles().includes(role);
  //   }

  /**
   * Refresh current user data from server
   */
  refreshCurrentUser(): Observable<void> {
    return this._userService.getAdminProfile().pipe(
      map(response => {
        if (response.success && response.data) {
          const currentUser = this.getCurrentUser();
          const updatedUser: EmployeeInfo = {
            ...currentUser!,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            designationName: response.data.designationName,
          };
          this.setCurrentUser(updatedUser);
          localStorage.setItem(this.storageKeys.user, JSON.stringify(updatedUser));
        }
      })
    );
  }
}