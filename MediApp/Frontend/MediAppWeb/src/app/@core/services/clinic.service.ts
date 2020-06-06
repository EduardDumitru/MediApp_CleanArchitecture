import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClinicData, ClinicDetails, ClinicsList, AddClinicCommand, UpdateClinicCommand, RestoreClinicCommand } from '../data/clinic';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class ClinicService extends ClinicData {
    baseUrl = environment.baseURL + 'Clinic';

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


    GetClinicDetails(id: number): Observable<ClinicDetails> {
        return this.http.get<ClinicDetails>(this.baseUrl + '/' + id, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetClinics(): Observable<ClinicsList> {
        return this.http.get<ClinicsList>(this.baseUrl, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetClinicsDropdown(countryId?: number, countyId?: number, cityId?: number): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/clinicsdropdown/' +
        countryId + '/' + countyId + '/' + cityId, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddClinic(addClinicCommand: AddClinicCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addClinicCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateClinic(updateClinicCommand: UpdateClinicCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateClinicCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteClinic(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreClinic(restoreClinicCommand: RestoreClinicCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreClinicCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
