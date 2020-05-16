import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad, Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {

  constructor(public authService: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuth()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  canLoad(route: Route) {
    if (this.authService.isAuth()) {
        return true;
    } else {
        this.router.navigate(['login']);
    }
  }
}
