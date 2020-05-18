import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrescriptionData, PrescriptionDetails,
    EmployeePrescriptionsList, PatientPrescriptionsList, AddPrescriptionCommand, UpdatePrescriptionCommand } from '../data/prescription';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class PrescriptionService extends PrescriptionData {
    baseUrl = environment.baseURL + 'Prescription';

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


    GetPrescriptionDetails(id: number): Observable<PrescriptionDetails> {
        return this.http.get<PrescriptionDetails>(this.baseUrl + '/' + id, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetEmployeePrescriptions(employeeId: number): Observable<EmployeePrescriptionsList> {
        return this.http.get<EmployeePrescriptionsList>(this.baseUrl + '/employeeprescriptions/' + employeeId, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetPatientPrescriptions(patientId: number): Observable<PatientPrescriptionsList> {
        return this.http.get<PatientPrescriptionsList>(this.baseUrl + '/patientprescriptions/' + patientId, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetPrescriptionsDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/prescriptionsdropdown', this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddPrescription(addPrescriptionCommand: AddPrescriptionCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addPrescriptionCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdatePrescription(updatePrescriptionCommand: UpdatePrescriptionCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updatePrescriptionCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeletePrescription(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
