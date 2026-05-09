import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { BalanceService } from '../../../core/services/balance.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './transfer.html',
  styleUrl: './transfer.css'
})
export class Transfer implements OnInit {
  transferForm: FormGroup;
  downlineUsers: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private balanceService: BalanceService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.transferForm = this.fb.group({
      targetUserId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });

    const user = this.authService.currentUser();
    this.isAdmin = user?.role === 'Admin';
  }

  ngOnInit(): void {
    this.loadEligibleReceivers();
  }

  loadEligibleReceivers(): void {
    if (this.authService.currentUser()?.role === 'Admin') {
      // Admins can transfer to anyone in the hierarchy (deducted from parent)
      // For simplicity in UI, we might load all users or let them search. 
      // Assuming getDownline fetches everyone for admin for now.
      this.userService.getDownline().subscribe({
        next: (res) => this.downlineUsers = res.data
      });
    } else {
      // Normal users can only transfer to downline
      this.userService.getDownline().subscribe({
        next: (res) => {
          // Filter direct children only for normal transfer, but requirement says "next-level users only"
          const currentId = this.authService.currentUser()?.id;
          this.downlineUsers = res.data.filter((u: any) => u.parentId?._id === currentId || u.parentId === currentId);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.transferForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.transferForm.value;
    const request = this.authService.currentUser()?.role === 'Admin' 
      ? this.balanceService.adminTransfer(payload)
      : this.balanceService.transfer(payload);

    request.subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = `Successfully transferred ₹${payload.amount}.`;
          this.transferForm.reset();
          setTimeout(() => this.router.navigate(['/dashboard']), 2000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Transfer failed.';
      }
    });
  }
}
