import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {

  constructor(public jwtHelper: JwtHelperService) {}
  // ...

  public isAuthenticated(): boolean {
    const token = this.getToken();
    // Check whether the token is expired and return
    // true or false
    if (token == null) {
        return false;
    } else {
        return !this.jwtHelper.isTokenExpired(token);
    }
  }

  public setToken(token: string) {
    localStorage.setItem(environment.authToken, token);
  }

  public getToken(): string {
    return localStorage.getItem(environment.authToken);
  }

  public decodeToken(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }

  public logout(): void {
    localStorage.removeItem(environment.authToken);
  }
}
