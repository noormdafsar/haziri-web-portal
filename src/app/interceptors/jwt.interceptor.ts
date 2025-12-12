import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { environment } from '../../environment/environment';

export const jwtInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  let clonedRequest = req.clone({
    setHeaders: {
      'X-App-Type': environment.appType
    }
  });

  // Skip token injection for auth endpoints
  if (isAuthEndpoint(req.url)) {
    return next(clonedRequest);
  }

  const token = authService.getAccessToken();

  if (token) {
    // Check if token is near expiry and refresh if needed
    if (authService.isTokenNearExpiry()) {
      return handleTokenRefresh(authService, req, next, environment.appType);
    }

    // Add Authorization and appType headers
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-App-Type': environment.appType
      }
    })
    
    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return handleUnauthorized(authService, req, next, environment.appType);
        }
        return throwError(() => error);
      })
    );
  } else {
    return next(clonedRequest);
  }
};

// Token refresh state management
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

function handleTokenRefresh(
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  appType: string
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        if (response.success && response.data) {
          refreshTokenSubject.next(response.data.accessToken);

          // Retry original request with new token + appType
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.data.accessToken}`,
              'X-App-Type': appType
            }
          });

          return next(authReq);
        } else {
          authService.logout().subscribe();
          window.location.href = '/login';
          return throwError(() => new Error(response.message || 'Token refresh failed'));
        }
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logout().subscribe();
        window.location.href = '/login';
        return throwError(() => error);
      })
    );
  } else {
    // Wait for token refresh
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'X-App-Type': appType
          }
        });
        return next(authReq);
      })
    );
  }
}

function handleUnauthorized(
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  appType: string
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        if (response.success && response.data) {
          refreshTokenSubject.next(response.data.accessToken);

          // Retry request with new token + appType
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${response.data.accessToken}`,
              'X-App-Type': appType
            }
          });

          return next(authReq);
        } else {
          authService.logout().subscribe();
          window.location.href = '/login';
          return throwError(() => new Error(response.message || 'Token refresh failed'));
        }
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logout().subscribe();
        window.location.href = '/login';
        return throwError(() => error);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'X-App-Type': appType
          }
        });
        return next(authReq);
      })
    );
  }
}

function isAuthEndpoint(url: string): boolean {
  const authEndpoints = [
    '/api/auth/login',
    '/api/auth/refresh-token'
  ];

  return authEndpoints.some(endpoint => url.includes(endpoint));
}
