import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HolidayIntervalData, HolidayIntervalDetails,
    HolidayIntervalsList, AddHolidayIntervalCommand,
    UpdateHolidayIntervalCommand, RestoreHolidayIntervalCommand } from '../data/holidayinterval';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class HolidayIntervalService extends HolidayIntervalData {
    baseUrl = environment.baseURL + 'HolidayInterval';

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


    GetHolidayIntervalDetails(id: number): Observable<HolidayIntervalDetails> {
        return this.http.get<HolidayIntervalDetails>(this.baseUrl + '/' + id, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetHolidayIntervals(): Observable<HolidayIntervalsList> {
        return this.http.get<HolidayIntervalsList>(this.baseUrl, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddHolidayInterval(addHolidayIntervalCommand: AddHolidayIntervalCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addHolidayIntervalCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateHolidayInterval(updateHolidayIntervalCommand: UpdateHolidayIntervalCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateHolidayIntervalCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteHolidayInterval(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreHolidayInterval(restoreHolidayIntervalCommand: RestoreHolidayIntervalCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreHolidayIntervalCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
