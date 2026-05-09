import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private apiUrl = `${environment.apiUrl}/balance`;
  private adminApiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getBalance(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  recharge(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/recharge`, { amount });
  }

  transfer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, data);
  }

  getStatement(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statement`);
  }

  // Admin endpoints
  adminTransfer(data: any): Observable<any> {
    return this.http.post(`${this.adminApiUrl}/transfer`, data);
  }

  getAdminBalanceSummary(): Observable<any> {
    return this.http.get(`${this.adminApiUrl}/balance-summary`);
  }
}
