import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { GenderDetails, AddGenderCommand, UpdateGenderCommand, RestoreGenderCommand, GendersList, GenderData } from '../data/gender';
import { retry, catchError, map } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class GenderService extends GenderData {
    baseUrl = environment.baseURL + 'Gender';

    // Http Headers
        httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}`
        })
    };

    constructor(private http: HttpClient, private errService: ErrorService, private authService: AuthService) {
        super();
    }


    GetGenderDetails(id: number): Observable<GenderDetails> {
        return this.http.get<GenderDetails>(this.baseUrl + '/' + id, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetGenders(): Observable<GendersList> {
        return this.http.get<GendersList>(this.baseUrl, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetGendersDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/gendersdropdown')
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddGender(addGenderCommand: AddGenderCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addGenderCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateGender(updateGenderCommand: UpdateGenderCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateGenderCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteGender(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreGender(restoreGenderCommand: RestoreGenderCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreGenderCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}