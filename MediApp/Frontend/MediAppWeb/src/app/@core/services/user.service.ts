import { of as observableOf,  Observable, throwError, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserData, AddUserCommand, LoginUserCommand } from '../data/userclasses/user';
import { CurrentUser } from '../data/userclasses/currentuser';
import { AuthSuccessResponse } from '../data/common/authresponse';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { ErrorService } from 'src/app/shared/error.service';

@Injectable()
export class UserService extends UserData {
    baseUrl = environment.baseURL + 'User';
    constructor(private http: HttpClient, private authService: AuthService, private errService: ErrorService) {
        super();
    }

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    AddUser(addUserCommand: AddUserCommand): Observable<AuthSuccessResponse> {
        return this.http.post<AuthSuccessResponse>(this.baseUrl + '/adduser', JSON.stringify(addUserCommand), this.httpOptions)
            .pipe(
                map(res => {
                    return res;
                }),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }

    LoginUser(loginUserCommand: LoginUserCommand): Observable<AuthSuccessResponse> {
        return this.http.post<AuthSuccessResponse>(this.baseUrl + '/login', JSON.stringify(loginUserCommand), this.httpOptions)
            .pipe(
                map(res => {
                    return res;
                }),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }

    GetCurrentUser(): Observable<CurrentUser> {
        const token = this.authService.getDecodedToken();
        const user = new CurrentUser();
        user.email = token.email;
        user.firstName = token.firstName;
        user.lastName = token.lastName;
        user.id = token.id;
        return observableOf(user);
    }

}
