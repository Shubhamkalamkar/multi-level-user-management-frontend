import { Component, OnInit, ViewChild, effect } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { BalanceService } from '../../../core/services/balance.service';
import { AuthService } from '../../../core/services/auth.service';
import { SocketService } from '../../../core/services/socket.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-statement',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './statement.html',
  styleUrl: './statement.css'
})
export class Statement implements OnInit {
  displayedColumns: string[] = ['timestamp', 'type', 'sender', 'receiver', 'amount', 'commission'];
  dataSource!: MatTableDataSource<any>;
  isLoading = true;
  currentUserId: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private balanceService: BalanceService,
    private authService: AuthService,
    private socketService: SocketService
  ) {
    const user = this.authService.currentUser();
    if (user) {
      this.currentUserId = user.id;
    }

    let isFirstRun = true;
    effect(() => {
      // Read the signal to track it
      this.socketService.realTimeBalance();
      if (!isFirstRun) {
        this.fetchStatement();
      }
      isFirstRun = false;
    });
  }

  ngOnInit(): void {
    this.fetchStatement();
  }

  fetchStatement(): void {
    this.balanceService.getStatement().subscribe({
      next: (res) => {
        if (res.success) {
          // Process data to easily identify if it's credit in or out for the current user
          const processedData = res.data.map((tx: any) => ({
            ...tx,
            isIncoming: tx.receiverId._id === this.currentUserId
          }));
          
          this.dataSource = new MatTableDataSource(processedData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to fetch statement', err);
        this.isLoading = false;
      }
    });
  }
}
