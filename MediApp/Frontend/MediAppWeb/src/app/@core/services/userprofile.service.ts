import { of as observableOf,  Observable, throwError, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserProfileData, UserProfileDetail, UpdateUserProfileCommand, UserProfilesList } from '../data/userclasses/userprofile';
import { environment } from 'src/environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { Result } from '../data/common/result';
import { map } from 'rxjs/operators';
@Injectable()
export class UserProfileService extends UserProfileData {
    baseUrl = environment.baseURL + 'UserProfile';

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
                map((response: any) => response.json()),
                catchError(this.handleError)
            );
    }
    getUserProfile(id: number): Observable<UserProfileDetail> {
        return this.http.get<UserProfileDetail>(this.baseUrl + '/' + id)
            .pipe(
                map((response: any) => response.json()),
                catchError(this.handleError)
            );
    }
    updateUserProfile(userProfile: UpdateUserProfileCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(userProfile), this.httpOptions)
            .pipe(
                map((response: any) => response.json()),
                catchError(this.handleError)
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

     protected handleError(error: any) {
        const applicationError = error.headers.get('Application-Error');

        // either applicationError in header or model error in body
        if (applicationError) {
          return throwError(applicationError);
        }

        let modelStateErrors = '';
        const serverError = error.json();

        if (!serverError.type) {
          for (const key in serverError) {
            if (serverError[key]) {
              modelStateErrors += serverError[key] + '\n';
            }
          }
        }

        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

        return throwError(modelStateErrors || 'Server error');
      }
}
