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
    const roles = [...tokenPayload.role];
    if (!this.authService.isAuth()) {
        this.router.navigate(['login']);
        return false;
    } else if (roles.filter(role => expectedRoles.filter(eRole => eRole === role).length > 0).length === 0) {
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
    const roles = [...tokenPayload.role];
    if (!this.authService.isAuth()) {
        this.router.navigate(['login']);
        return false;
    } else if (roles.filter(role => expectedRoles.filter(eRole => eRole === role).length > 0).length === 0) {
        this.router.navigate(['notfound']);
        return false;
    }
    return true;
  }
}
