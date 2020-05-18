import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DiagnosisXDrugData, AddDiagnosisXDrugCommand, RestoreDiagnosisXDrugCommand, DiagnosisXDrugsList } from '../data/diagnosisxdrug';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class DiagnosisXDrugService extends DiagnosisXDrugData {
    baseUrl = environment.baseURL + 'DiagnosisXDrug';

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



    GetDiagnosisXDrugs(): Observable<DiagnosisXDrugsList> {
        return this.http.get<DiagnosisXDrugsList>(this.baseUrl, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetDrugsByDiagnosisDropdown(diagnosisId: number): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/drugsbydiagnosesdropdown/' + diagnosisId, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddDiagnosisXDrug(addDiagnosisXDrugCommand: AddDiagnosisXDrugCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addDiagnosisXDrugCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    DeleteDiagnosisXDrug(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreDiagnosisXDrug(restoreDiagnosisXDrugCommand: RestoreDiagnosisXDrugCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreDiagnosisXDrugCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
