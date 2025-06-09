import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticatedAsync()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

// Modern functional guard approach
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Use the enhanced isAuthenticated() method
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};