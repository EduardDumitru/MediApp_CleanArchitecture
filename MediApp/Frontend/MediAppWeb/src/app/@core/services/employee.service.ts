import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmployeeData, EmployeeDetails, EmployeesList,
    AddEmployeeCommand, UpdateEmployeeCommand, RestoreEmployeeCommand } from '../data/employee';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class EmployeeService extends EmployeeData {
    baseUrl = environment.baseURL + 'Employee';

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


    GetEmployeeDetails(id: number): Observable<EmployeeDetails> {
        return this.http.get<EmployeeDetails>(this.baseUrl + '/' + id, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetEmployees(): Observable<EmployeesList> {
        return this.http.get<EmployeesList>(this.baseUrl, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetEmployeesDropdown(clinicId: number, medicalCheckTypeId: number): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/employeesdropdown/' + clinicId + '/' + medicalCheckTypeId, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetAllEmployeesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/employeesdropdown', this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddEmployee(addEmployeeCommand: AddEmployeeCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addEmployeeCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateEmployee(updateEmployeeCommand: UpdateEmployeeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateEmployeeCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteEmployee(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreEmployee(restoreEmployeeCommand: RestoreEmployeeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreEmployeeCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
