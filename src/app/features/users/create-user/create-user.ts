import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css'
})
export class CreateUser {
  createUserForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.createUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      commissionRate: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  onSubmit(): void {
    if (this.createUserForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.createNextLevelUser(this.createUserForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.successMessage = `User ${res.data.username} created successfully!`;
          this.createUserForm.reset({ commissionRate: 0 });
          setTimeout(() => this.router.navigate(['/dashboard']), 2000);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create user.';
      }
    });
  }
}
