import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmployeeData, EmployeeDetails, EmployeesList,
    AddEmployeeCommand, UpdateEmployeeCommand, RestoreEmployeeCommand } from '../data/employee';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';

@Injectable()
export class EmployeeService extends EmployeeData {
    baseUrl = environment.baseURL + 'Employee';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetEmployeeDetails(id: number): Observable<EmployeeDetails> {
        return this.http.get<EmployeeDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetEmployees(): Observable<EmployeesList> {
        return this.http.get<EmployeesList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetEmployeesDropdown(clinicId: number, medicalCheckTypeId: number): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/employeesdropdown/' + clinicId + '/' + medicalCheckTypeId)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddEmployee(addEmployeeCommand: AddEmployeeCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addEmployeeCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateEmployee(updateEmployeeCommand: UpdateEmployeeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateEmployeeCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteEmployee(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    RestoreEmployee(restoreEmployeeCommand: RestoreEmployeeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreEmployeeCommand), this.httpOptions)
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
