import { of as observableOf,  Observable, throwError, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserProfileData, UserProfileDetail, UpdateUserProfileCommand, UserProfilesList } from '../data/userclasses/userprofile';
import { environment } from 'src/environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Result } from '../data/common/result';
import { map } from 'rxjs/operators';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';
import { SelectItemsList } from '../data/common/selectitem';
@Injectable()
export class UserProfileService extends UserProfileData {
    baseUrl = environment.baseURL + 'UserProfile';

    constructor(private http: HttpClient, private errService: ErrorService, private authService: AuthService) {
        super();
    }


    getUserProfiles(): Observable<UserProfilesList> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.get<UserProfilesList>(this.baseUrl, httpOptions)
            .pipe(
                map((response: any) => response),
                catchError(this.errService.errorHandl)
            );
    }
    getUserProfile(id: number): Observable<UserProfileDetail> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.get<UserProfileDetail>(this.baseUrl + '/' + id, httpOptions)
            .pipe(
                map((response: any) => response),
                catchError(this.errService.errorHandl)
            );
    }
    updateUserProfile(userProfile: UpdateUserProfileCommand): Observable<Result> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.put<Result>(this.baseUrl, JSON.stringify(userProfile), httpOptions)
            .pipe(
                map((response: any) => response),
                catchError(this.errService.errorHandl)
            );
    }
    getUserProfilesDropdown(): Observable<SelectItemsList> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.get<SelectItemsList>(this.baseUrl + '/usersdropdown', httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
