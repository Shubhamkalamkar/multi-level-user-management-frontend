import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recharge-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatInputModule,
    MatIconModule
  ],
  template: `
    <div class="p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <mat-icon>add_card</mat-icon>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 m-0">Self Recharge</h2>
      </div>
      
      <p class="text-gray-600 mb-6 text-sm">Enter the amount of INR you want to instantly add to your owner wallet.</p>
      
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Amount (INR)</mat-label>
        <span matTextPrefix class="mr-1 font-bold text-gray-500">₹</span>
        <input matInput type="number" [(ngModel)]="amount" min="1" placeholder="e.g., 500" required autofocus>
      </mat-form-field>
      
      <div class="flex justify-end gap-3 mt-4">
        <button mat-button mat-dialog-close class="text-gray-600">Cancel</button>
        <button mat-flat-button color="primary" [disabled]="!amount || amount <= 0" (click)="onRecharge()">
          Add Funds
        </button>
      </div>
    </div>
  `
})
export class RechargeDialogComponent {
  amount: number | null = null;

  constructor(public dialogRef: MatDialogRef<RechargeDialogComponent>) {}

  onRecharge(): void {
    if (this.amount && this.amount > 0) {
      this.dialogRef.close(this.amount);
    }
  }
}
