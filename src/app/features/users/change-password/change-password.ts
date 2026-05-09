import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
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
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword implements OnInit {
  passwordForm: FormGroup;
  downlineUsers: any[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.passwordForm = this.fb.group({
      targetUserId: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadDirectChildren();
    this.route.queryParams.subscribe(params => {
      if (params['userId']) {
        this.passwordForm.patchValue({ targetUserId: params['userId'] });
      }
    });
  }

  loadDirectChildren(): void {
    const currentId = this.authService.currentUser()?.id;
    this.userService.getDownline().subscribe({
      next: (res) => {
        if (res.success) {
          // Changed from 1-level to full downline, matching transfer logic
          this.downlineUsers = res.data;
        }
      }
    });
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.changePassword(this.passwordForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = 'Password updated successfully!';
          this.passwordForm.reset();
          setTimeout(() => this.router.navigate(['/dashboard']), 2000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to update password.';
      }
    });
  }
}
