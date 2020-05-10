import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { DrugDetails, DrugsList, AddDrugCommand, UpdateDrugCommand, RestoreDrugCommand, DrugData } from '../data/drug';
import { retry, catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';

@Injectable()
export class DrugService extends DrugData {
    baseUrl = environment.baseURL + 'drug';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetDrugDetails(id: number): Observable<DrugDetails> {
        return this.http.get<DrugDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetDrugs(): Observable<DrugsList> {
        return this.http.get<DrugsList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetDrugsDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/drugsdropdown')
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddDrug(addDrugCommand: AddDrugCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addDrugCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateDrug(updateDrugCommand: UpdateDrugCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateDrugCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteDrug(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    RestoreDrug(restoreDrugCommand: RestoreDrugCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreDrugCommand), this.httpOptions)
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
