import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private adminApiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  createNextLevelUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, userData);
  }

  getDownline(): Observable<any> {
    return this.http.get(`${this.apiUrl}/downline`);
  }

  changePassword(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password`, data);
  }

  // Admin endpoints
  getAdminNextLevel(): Observable<any> {
    return this.http.get(`${this.adminApiUrl}/next-level`);
  }

  getAdminFullDownline(targetUserId: string): Observable<any> {
    return this.http.get(`${this.adminApiUrl}/downline/${targetUserId}`);
  }
}
