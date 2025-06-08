import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {
  constructor(public authService: AuthService, public router: Router) { }

  checkIfUserHasExpectedRole(arr1: string[], arr2: string[]): boolean {
    const [smallArray, bigArray] =
      arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1];
    return smallArray.some((c: string) => bigArray.includes(c));
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config on the data property
    const expectedRoles = route.data['expectedRoles'];
    // decode the token to get its payload
    const tokenPayload = this.authService.getDecodedToken();
    const roles: string[] = [];

    if (!tokenPayload) {
      this.authService.logout();
      return false;
    }

    if (Array.isArray(tokenPayload.role)) {
      roles.push(...tokenPayload.role);
    } else {
      roles.push(tokenPayload.role);
    }

    if (!this.authService.isAuth()) {
      this.router.navigate(['login']);
      return false;
    } else if (!this.checkIfUserHasExpectedRole(roles, expectedRoles)) {
      this.router.navigate(['notfound']);
      return false;
    }
    return true;
  }
}

/**
 * Functional role-based route guard for Angular 20+
 * @param expectedRoles Array of roles that can access the route
 * @returns A guard function for route protection
 */
export const roleGuard = (expectedRoles: string[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Get token payload
    const tokenPayload = authService.getDecodedToken();
    const roles: string[] = [];

    if (!tokenPayload) {
      authService.logout();
      return false;
    }

    // Handle both string and array role formats
    if (Array.isArray(tokenPayload.role)) {
      roles.push(...tokenPayload.role);
    } else {
      roles.push(tokenPayload.role);
    }

    // Check authentication and role
    if (!authService.isAuth()) {
      router.navigate(['login']);
      return false;
    }

    // Check if user has any of the required roles
    const hasRequiredRole = checkIfUserHasRole(roles, expectedRoles);
    if (!hasRequiredRole) {
      router.navigate(['notfound']);
      return false;
    }

    return true;
  };
};

/**
 * Helper function to check if arrays have at least one common element
 */
function checkIfUserHasRole(userRoles: string[], requiredRoles: string[]): boolean {
  const [smallArray, bigArray] =
    userRoles.length < requiredRoles.length ? [userRoles, requiredRoles] : [requiredRoles, userRoles];
  return smallArray.some((role: string) => bigArray.includes(role));
}