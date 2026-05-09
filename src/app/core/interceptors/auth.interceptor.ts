import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Always attach credentials (cookies) to outgoing requests
  const modifiedReq = req.clone({
    withCredentials: true
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If unauthorized (e.g. token expired, or cleared cookie)
      if (error.status === 401) {
        // Clear the local state forcefully
        authService.currentUser.set(null);
        localStorage.removeItem('user');
        
        // Redirect to login page
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
