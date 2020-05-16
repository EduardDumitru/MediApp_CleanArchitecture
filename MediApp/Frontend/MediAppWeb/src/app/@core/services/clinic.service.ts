import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClinicData, ClinicDetails, ClinicsList, AddClinicCommand, UpdateClinicCommand, RestoreClinicCommand } from '../data/clinic';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';

@Injectable()
export class ClinicService extends ClinicData {
    baseUrl = environment.baseURL + 'Clinic';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetClinicDetails(id: number): Observable<ClinicDetails> {
        return this.http.get<ClinicDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetClinics(): Observable<ClinicsList> {
        return this.http.get<ClinicsList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetClinicsDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/clinicsdropdown')
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddClinic(addClinicCommand: AddClinicCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addClinicCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateClinic(updateClinicCommand: UpdateClinicCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateClinicCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteClinic(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    RestoreClinic(restoreClinicCommand: RestoreClinicCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreClinicCommand), this.httpOptions)
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
