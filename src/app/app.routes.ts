import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Overview } from './features/dashboard/overview/overview';
import { Statement } from './features/dashboard/statement/statement';
import { CreateUser } from './features/users/create-user/create-user';
import { Hierarchy } from './features/users/hierarchy/hierarchy';
import { ChangePassword } from './features/users/change-password/change-password';
import { Transfer } from './features/balance/transfer/transfer';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { 
    path: 'dashboard', 
    component: Overview,
    canActivate: [authGuard]
  },
  { 
    path: 'statement', 
    component: Statement,
    canActivate: [authGuard]
  },
  { 
    path: 'create-user', 
    component: CreateUser,
    canActivate: [authGuard]
  },
  { 
    path: 'hierarchy', 
    component: Hierarchy,
    canActivate: [authGuard]
  },
  { 
    path: 'transfer', 
    component: Transfer,
    canActivate: [authGuard]
  },
  {
    path: 'change-password',
    component: ChangePassword,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
