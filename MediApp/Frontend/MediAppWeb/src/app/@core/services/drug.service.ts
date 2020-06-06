import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { DrugDetails, DrugsList, AddDrugCommand, UpdateDrugCommand, RestoreDrugCommand, DrugData } from '../data/drug';
import { retry, catchError, map } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class DrugService extends DrugData {
    baseUrl = environment.baseURL + 'Drug';

    constructor(private http: HttpClient, private errService: ErrorService, private authService: AuthService) {
        super();
    }


    GetDrugDetails(id: number): Observable<DrugDetails> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.get<DrugDetails>(this.baseUrl + '/' + id, httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetDrugs(): Observable<DrugsList> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.get<DrugsList>(this.baseUrl, httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetDrugsDropdown(): Observable<SelectItemsList> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.get<SelectItemsList>(this.baseUrl + '/drugsdropdown', httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddDrug(addDrugCommand: AddDrugCommand): Observable<Result> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addDrugCommand), httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateDrug(updateDrugCommand: UpdateDrugCommand): Observable<Result> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateDrugCommand), httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteDrug(id: number): Observable<Result> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.delete<Result>(this.baseUrl + '/' + id, httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreDrug(restoreDrugCommand: RestoreDrugCommand): Observable<Result> {
        const httpOptions = {
            headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
            })
        };
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreDrugCommand), httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
