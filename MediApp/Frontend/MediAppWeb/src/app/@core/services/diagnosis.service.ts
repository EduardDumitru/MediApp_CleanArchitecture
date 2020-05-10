import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiagnosisData, DiagnosisDetails,
    AddDiagnosisCommand, UpdateDiagnosisCommand, RestoreDiagnosisCommand, DiagnosesList } from '../data/diagnosis';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';

@Injectable()
export class DiagnosisService extends DiagnosisData {
    baseUrl = environment.baseURL + 'diagnosis';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetDiagnosisDetails(id: number): Observable<DiagnosisDetails> {
        return this.http.get<DiagnosisDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetDiagnoses(): Observable<DiagnosesList> {
        return this.http.get<DiagnosesList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetDiagnosesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/diagnosesdropdown')
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddDiagnosis(addDiagnosisCommand: AddDiagnosisCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addDiagnosisCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateDiagnosis(updateDiagnosisCommand: UpdateDiagnosisCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateDiagnosisCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteDiagnosis(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    RestoreDiagnosis(restoreDiagnosisCommand: RestoreDiagnosisCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreDiagnosisCommand), this.httpOptions)
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
