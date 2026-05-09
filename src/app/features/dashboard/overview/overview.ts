import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { SocketService } from '../../../core/services/socket.service';
import { BalanceService } from '../../../core/services/balance.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview implements OnInit {
  currentUser: User | null = null;
  balance: number | null = null;

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private balanceService: BalanceService
  ) {
    // Listen to auth state
    effect(() => {
      this.currentUser = this.authService.currentUser();
    });

    // Listen to real-time balance updates
    effect(() => {
      const realTimeBal = this.socketService.realTimeBalance();
      if (realTimeBal !== null) {
        this.balance = realTimeBal;
      }
    });
  }

  ngOnInit(): void {
    this.balanceService.getBalance().subscribe({
      next: (res) => {
        if (res.success && this.balance === null) {
          this.balance = res.balance;
        }
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Router will handle redirect via guard or manual navigation
        window.location.href = '/login';
      }
    });
  }
}
