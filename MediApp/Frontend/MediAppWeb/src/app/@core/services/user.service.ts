import { of as observableOf,  Observable, throwError, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserData, AddUserCommand, LoginUserCommand } from '../data/userclasses/user';
import { CurrentUser } from '../data/userclasses/currentuser';
import { AuthSuccessResponse } from '../data/common/authresponse';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UserService extends UserData {
    baseUrl = environment.baseURL + 'User';
    constructor(private http: HttpClient, private authService: AuthService) {
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
                catchError(this.errorHandl)
            );
    }

    LoginUser(loginUserCommand: LoginUserCommand): Observable<AuthSuccessResponse> {
        return this.http.post<AuthSuccessResponse>(this.baseUrl + '/login', JSON.stringify(loginUserCommand), this.httpOptions)
            .pipe(
                map(res => {
                    return res;
                }),
                retry(1),
                catchError(this.errorHandl)
            );
    }

    GetCurrentUser(): Observable<CurrentUser> {
        const token = this.authService.decodeToken(this.authService.getToken());
        const user = new CurrentUser();
        user.email = token.email;
        user.firstName = token.firstName;
        user.lastName = token.lastName;
        user.id = token.id;
        return observableOf(user);
    }

    errorHandl(error) {
        let errorMessage = ''
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;

        } else {
          // Get server-side error
            const obj = error.error.errors;
            if(Object.keys(obj).length) {
                Object.keys(obj).forEach(key => {
                    if (obj[key] instanceof Array) {
                        obj[key].forEach((elError: string) => {
                            errorMessage += elError + '\n';
                        });
                    } else if (obj instanceof Array) {
                        obj.forEach((elError: string) => {
                            errorMessage += elError + '\n';
                        });
                    }
                });
            }
        }
        return throwError(errorMessage);
     }

}
