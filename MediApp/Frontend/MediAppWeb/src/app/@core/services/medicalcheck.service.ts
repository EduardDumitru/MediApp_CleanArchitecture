import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MedicalCheckData, MedicalCheckDetails,
    AddMedicalCheckCommand, UpdateMedicalCheckCommand, EmployeeMedicalChecksList, PatientMedicalChecksList } from '../data/medicalcheck';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';

@Injectable()
export class MedicalCheckService extends MedicalCheckData {
    baseUrl = environment.baseURL + 'medicalcheck';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetMedicalCheckDetails(id: number): Observable<MedicalCheckDetails> {
        return this.http.get<MedicalCheckDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetEmployeeMedicalChecks(employeeId: number): Observable<EmployeeMedicalChecksList> {
        return this.http.get<EmployeeMedicalChecksList>(this.baseUrl + '/employeemedicalchecks/' + employeeId)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetPatientMedicalChecks(patientId: number): Observable<PatientMedicalChecksList> {
        return this.http.get<PatientMedicalChecksList>(this.baseUrl + '/patientmedicalchecks/' + patientId)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetMedicalChecksDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/medicalchecksdropdown')
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddMedicalCheck(addMedicalCheckCommand: AddMedicalCheckCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addMedicalCheckCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateMedicalCheck(updateMedicalCheckCommand: UpdateMedicalCheckCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateMedicalCheckCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteMedicalCheck(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
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
