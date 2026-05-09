import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { SocketService } from '../../../core/services/socket.service';
import { BalanceService } from '../../../core/services/balance.service';
import { AdminService } from '../../../core/services/admin.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RechargeDialogComponent } from './recharge-dialog';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule, MatDialogModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview implements OnInit {
  currentUser: User | null = null;
  balance: number | null = null;
  adminSummary: any = null;
  isRecharging = false;

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private balanceService: BalanceService,
    private adminService: AdminService,
    private dialog: MatDialog
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

    // If Admin or Owner, load balance summary
    if (this.currentUser?.role === 'Admin' || this.currentUser?.role === 'Owner') {
      this.adminService.getBalanceSummary().subscribe({
        next: (res) => {
          if (res.success) {
            this.adminSummary = res;
          }
        }
      });
    }
  }

  rechargeBalance(): void {
    const dialogRef = this.dialog.open(RechargeDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(amount => {
      if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
        this.isRecharging = true;
        this.balanceService.recharge(Number(amount)).subscribe({
          next: (res) => {
            this.isRecharging = false;
            if (res.success) {
              this.balance = res.balance;
              // alert(`Successfully recharged $${amount}.`); // Optional: could use a snackbar instead
            }
          },
          error: (err) => {
            this.isRecharging = false;
            alert(err.error?.message || 'Recharge failed.');
          }
        });
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
