import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, CanLoad, Route} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class RoleGuardService implements CanActivate, CanLoad {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
        // this will be passed from the route config
    // on the data property
    const expectedRoles = route.data.expectedRoles;
    // decode the token to get its payload
    const tokenPayload = this.authService.getDecodedToken();
    const roles = [];
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

  canLoad(route: Route) {
    // this will be passed from the route config
    // on the data property
    const expectedRoles = route.data.expectedRoles;
    // decode the token to get its payload
    const tokenPayload = this.authService.getDecodedToken();
    const roles = [];
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

  checkIfUserHasExpectedRole(arr1: string[], arr2: string[]) {
    const [smallArray, bigArray] =
      arr1.length < arr2.length ? [arr1, arr2] : [arr2, arr1];
    return smallArray.some((c: string) => bigArray.includes(c));
  };
}
