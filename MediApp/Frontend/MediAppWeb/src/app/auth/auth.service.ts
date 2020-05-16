import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Subject, of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  authChange = new BehaviorSubject<boolean>(false);
  private isUserAuthenticated = false;

  constructor(private router: Router,
    public jwtHelper: JwtHelperService) {}
  // ...

  initAuthListener() {
    this.isAuthenticated().subscribe(user => {
        if (user) {
            this.isUserAuthenticated = true;
            this.authChange.next(true);
            this.router.navigate(['/dashboard']);
        } else {
            this.isUserAuthenticated = false;
            this.authChange.next(false);
            this.router.navigate(['/login']);
        }
    });
}

  public isAuthenticated(): Observable<boolean> {
    const token = this.getToken();
    // Check whether the token is expired and return
    // true or false
    if (token == null) {
        return observableOf(false);
    } else {
        return observableOf(!this.jwtHelper.isTokenExpired(token));
    }
  }

  public isAuth(): boolean {
    return this.isUserAuthenticated;
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
    this.isUserAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }
}
