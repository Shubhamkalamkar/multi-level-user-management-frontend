import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm: FormGroup;
  captchaSvg: SafeHtml | string = '';
  sessionId: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      captchaText: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCaptcha();
  }

  loadCaptcha(): void {
    this.authService.getCaptcha().subscribe({
      next: (res) => {
        if (res.success) {
          this.captchaSvg = this.sanitizer.bypassSecurityTrustHtml(res.captcha);
          this.sessionId = res.sessionId;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load CAPTCHA. Please refresh.';
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    
    const credentials = {
      ...this.loginForm.value,
      sessionId: this.sessionId
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed';
        this.loadCaptcha(); // Reload captcha on failure
        this.loginForm.get('captchaText')?.reset();
      }
    });
  }
}
