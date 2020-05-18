import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiagnosisData, DiagnosisDetails,
    AddDiagnosisCommand, UpdateDiagnosisCommand, RestoreDiagnosisCommand, DiagnosesList } from '../data/diagnosis';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class DiagnosisService extends DiagnosisData {
    baseUrl = environment.baseURL + 'Diagnosis';

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


    GetDiagnosisDetails(id: number): Observable<DiagnosisDetails> {
        return this.http.get<DiagnosisDetails>(this.baseUrl + '/' + id, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetDiagnoses(): Observable<DiagnosesList> {
        return this.http.get<DiagnosesList>(this.baseUrl, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetDiagnosesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/diagnosesdropdown', this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddDiagnosis(addDiagnosisCommand: AddDiagnosisCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addDiagnosisCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateDiagnosis(updateDiagnosisCommand: UpdateDiagnosisCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateDiagnosisCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteDiagnosis(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreDiagnosis(restoreDiagnosisCommand: RestoreDiagnosisCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreDiagnosisCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
