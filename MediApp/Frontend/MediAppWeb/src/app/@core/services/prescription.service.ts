import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrescriptionData, PrescriptionDetails,
    EmployeePrescriptionsList, PatientPrescriptionsList, AddPrescriptionCommand, UpdatePrescriptionCommand } from '../data/prescription';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';

@Injectable()
export class PrescriptionService extends PrescriptionData {
    baseUrl = environment.baseURL + 'Prescription';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetPrescriptionDetails(id: number): Observable<PrescriptionDetails> {
        return this.http.get<PrescriptionDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetEmployeePrescriptions(employeeId: number): Observable<EmployeePrescriptionsList> {
        return this.http.get<EmployeePrescriptionsList>(this.baseUrl + '/employeeprescriptions/' + employeeId)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetPatientPrescriptions(patientId: number): Observable<PatientPrescriptionsList> {
        return this.http.get<PatientPrescriptionsList>(this.baseUrl + '/patientprescriptions/' + patientId)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetPrescriptionsDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/prescriptionsdropdown')
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddPrescription(addPrescriptionCommand: AddPrescriptionCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addPrescriptionCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdatePrescription(updatePrescriptionCommand: UpdatePrescriptionCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updatePrescriptionCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeletePrescription(id: number): Observable<Result> {
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
