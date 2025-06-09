import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';

export interface DecodedToken {
  id: string;
  role: string | string[];
  clinicId: string;
  exp: number;
  iss: string;
  aud: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly UserRoleName = 'User';
  readonly authChange = new BehaviorSubject<boolean>(false);
  readonly isAdmin = new BehaviorSubject<boolean>(false);
  readonly isDoctor = new BehaviorSubject<boolean>(false);
  readonly isNurse = new BehaviorSubject<boolean>(false);
  readonly currentUserId = new BehaviorSubject<number>(-1);
  readonly clinicId = new BehaviorSubject<number>(-1);

  // Use inject instead of constructor injection
  private readonly router = inject(Router);
  private readonly jwtHelper = inject(JwtHelperService);

  /**
   * Initialize authentication listener to check token validity
   * and update authentication state accordingly
   */
  initAuthListener(shouldNavigate = true): void {
    const token = this.getToken();

    // Check if token exists and isn't expired
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.authChange.next(true);

      // Process token data
      const decodedToken = this.getDecodedToken();
      if (decodedToken) {
        this.processUserRoles(decodedToken);
      } else {
        this.handleUnauthenticated(shouldNavigate);
      }
    } else {
      // Handle no token or expired token
      this.handleUnauthenticated(shouldNavigate);
    }
  }

  /**
   * Check if user is authenticated by validating JWT token
   * @returns Observable with authentication state
   */
  isAuthenticatedAsync(): Observable<boolean> {
    const token = this.getToken();

    if (!token) {
      return of(false);
    }

    return of(!this.jwtHelper.isTokenExpired(token));
  }

  /**
   * Get current authentication state
   * @returns Boolean indicating if user is authenticated
   */
  isAuthenticated(): boolean {
    // Update to check token validity, not just the flag
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const isExpired = this.jwtHelper.isTokenExpired(token);
      return !isExpired;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  }

  /**
   * Store JWT token in local storage
   * @param token JWT token string
   */
  setToken(token: string): void {
    localStorage.setItem(environment.authToken, token);
  }

  /**
   * Get JWT token from local storage
   * @returns JWT token string or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem(environment.authToken);
  }

  /**
   * Decode JWT token to access claims
   * @returns Decoded token data or null if token invalid
   */
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Log out the current user and clear authentication state
   */
  logout(): void {
    localStorage.removeItem(environment.authToken);
    this.resetAuthState();
    this.router.navigate(['/login']);
  }

  /**
   * Handle authenticated user state
   */
  public handleAuthenticated(): void {
    // Only update state, don't navigate
    this.authChange.next(true);

    const token = this.getDecodedToken();
    if (!token) {
      this.handleUnauthenticated(false); // Pass false to avoid navigation
      return;
    }

    this.processUserRoles(token);
  }

  /**
   * Process user roles from token and update role state
   * @param token Decoded JWT token
   */
  private processUserRoles(token: DecodedToken): void {
    const roles = this.extractRoles(token);

    this.isAdmin.next(roles.includes('Admin'));
    this.isDoctor.next(roles.includes('Doctor'));
    this.isNurse.next(roles.includes('Nurse'));

    this.currentUserId.next(+token.id);
    this.clinicId.next(+token.clinicId);
  }

  /**
   * Extract roles from token
   * @param token Decoded JWT token
   * @returns Array of role strings
   */
  private extractRoles(token: DecodedToken): string[] {
    const roles: string[] = [];

    if (Array.isArray(token.role)) {
      roles.push(...token.role);
    } else if (token.role) {
      roles.push(token.role);
    }

    return roles;
  }

  /**
   * Handle unauthenticated state
   */
  private handleUnauthenticated(shouldNavigate = true): void {
    this.resetAuthState();

    // Only navigate if the flag is true
    if (shouldNavigate) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Reset all authentication state to default values
   */
  private resetAuthState(): void {
    this.authChange.next(false);
    this.isAdmin.next(false);
    this.isDoctor.next(false);
    this.isNurse.next(false);
    this.currentUserId.next(-1);
    this.clinicId.next(-1);
  }
}