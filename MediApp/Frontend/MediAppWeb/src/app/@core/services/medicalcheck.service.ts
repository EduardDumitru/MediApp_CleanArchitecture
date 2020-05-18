import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MedicalCheckData, MedicalCheckDetails,
    AddMedicalCheckCommand, UpdateMedicalCheckCommand, EmployeeMedicalChecksList, PatientMedicalChecksList } from '../data/medicalcheck';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class MedicalCheckService extends MedicalCheckData {
    baseUrl = environment.baseURL + 'MedicalCheck';

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


    GetMedicalCheckDetails(id: number): Observable<MedicalCheckDetails> {
        return this.http.get<MedicalCheckDetails>(this.baseUrl + '/' + id, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetEmployeeMedicalChecks(employeeId: number): Observable<EmployeeMedicalChecksList> {
        return this.http.get<EmployeeMedicalChecksList>(this.baseUrl + '/employeemedicalchecks/' + employeeId, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetPatientMedicalChecks(patientId: number): Observable<PatientMedicalChecksList> {
        return this.http.get<PatientMedicalChecksList>(this.baseUrl + '/patientmedicalchecks/' + patientId, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetMedicalChecksDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/medicalchecksdropdown', this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddMedicalCheck(addMedicalCheckCommand: AddMedicalCheckCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addMedicalCheckCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateMedicalCheck(updateMedicalCheckCommand: UpdateMedicalCheckCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateMedicalCheckCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteMedicalCheck(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
