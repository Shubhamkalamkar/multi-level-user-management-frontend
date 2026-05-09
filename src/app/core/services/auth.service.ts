import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Using Angular 16+ Signals for state management
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    // Basic check if user exists in local storage to keep state across reloads
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  getCaptcha(): Observable<any> {
    return this.http.get(`${this.apiUrl}/captcha`);
  }

  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials).pipe(
      tap((res: any) => {
        if (res.success) {
          this.currentUser.set(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.success) {
          this.currentUser.set(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.currentUser.set(null);
        localStorage.removeItem('user');
      })
    );
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
