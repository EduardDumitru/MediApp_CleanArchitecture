import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HolidayIntervalData, HolidayIntervalDetails,
    HolidayIntervalsList, AddHolidayIntervalCommand,
    UpdateHolidayIntervalCommand, RestoreHolidayIntervalCommand } from '../data/holidayinterval';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Result } from '../data/common/result';

@Injectable()
export class HolidayIntervalService extends HolidayIntervalData {
    baseUrl = environment.baseURL + 'HolidayInterval';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetHolidayIntervalDetails(id: number): Observable<HolidayIntervalDetails> {
        return this.http.get<HolidayIntervalDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetHolidayIntervals(): Observable<HolidayIntervalsList> {
        return this.http.get<HolidayIntervalsList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddHolidayInterval(addHolidayIntervalCommand: AddHolidayIntervalCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addHolidayIntervalCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateHolidayInterval(updateHolidayIntervalCommand: UpdateHolidayIntervalCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateHolidayIntervalCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteHolidayInterval(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    RestoreHolidayInterval(restoreHolidayIntervalCommand: RestoreHolidayIntervalCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreHolidayIntervalCommand), this.httpOptions)
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
