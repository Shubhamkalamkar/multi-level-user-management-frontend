import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { effect } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | undefined;
  public realTimeBalance = signal<number | null>(null);

  constructor(private authService: AuthService) {
    // Listen to changes in the current user to connect/disconnect socket
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.connect(user.id);
      } else {
        this.disconnect();
      }
    });
  }

  private connect(userId: string): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    
    this.socket = io(environment.socketUrl, {
      withCredentials: true
    });

    this.socket.on(`balance_${userId}`, (data: { balance: number }) => {
      this.realTimeBalance.set(data.balance);
    });
  }

  private disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }
  }
}
