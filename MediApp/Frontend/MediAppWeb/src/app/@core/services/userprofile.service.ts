import { of as observableOf,  Observable, throwError, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserProfileData, UserProfileDetail, UpdateUserProfileCommand, UserProfilesList } from '../data/userclasses/userprofile';
import { environment } from 'src/environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Result } from '../data/common/result';

@Injectable()
export class UserProfileService extends UserProfileData {
    baseUrl = environment.baseURL + 'userprofile';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    getUserProfiles(): Observable<UserProfilesList> {
        return this.http.get<UserProfilesList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    getUserProfile(id: number): Observable<UserProfileDetail> {
        return this.http.get<UserProfileDetail>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    updateUserProfile(userProfile: UpdateUserProfileCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(userProfile), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }

    errorHandl(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
        } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(errorMessage);
     }
}
