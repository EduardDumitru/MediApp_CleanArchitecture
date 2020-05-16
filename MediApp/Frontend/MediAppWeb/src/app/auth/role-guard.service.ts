import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = this.auth.getToken();
    // decode the token to get its payload
    const tokenPayload = this.auth.decodeToken(token);
    if (!this.auth.isAuthenticated()) {
        this.router.navigate(['login']);
        return false;
    } else if (tokenPayload.role !== expectedRole) {
        this.router.navigate(['notfound']);
        return false;
    }
    return true;
  }
}
