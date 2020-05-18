import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { EmployeeTypeDetails, EmployeeTypesList,
    AddEmployeeTypeCommand, UpdateEmployeeTypeCommand, RestoreEmployeeTypeCommand, EmployeeTypeData } from '../data/employeetype';
import { retry, catchError, map } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class EmployeeTypeService extends EmployeeTypeData {
    baseUrl = environment.baseURL + 'EmployeeType';

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


    GetEmployeeTypeDetails(id: number): Observable<EmployeeTypeDetails> {
        return this.http.get<EmployeeTypeDetails>(this.baseUrl + '/' + id, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetEmployeeTypes(): Observable<EmployeeTypesList> {
        return this.http.get<EmployeeTypesList>(this.baseUrl, this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    GetEmployeeTypesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/employeetypesdropdown', this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    AddEmployeeType(addEmployeeTypeCommand: AddEmployeeTypeCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addEmployeeTypeCommand), this.httpOptions)
            .pipe(
                map((response: any) => response),
                retry(1),
                catchError(this.errService.errorHandl)
            );
    }
    UpdateEmployeeType(updateEmployeeTypeCommand: UpdateEmployeeTypeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateEmployeeTypeCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    DeleteEmployeeType(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
    RestoreEmployeeType(restoreEmployeeTypeCommand: RestoreEmployeeTypeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreEmployeeTypeCommand), this.httpOptions)
        .pipe(
            map((response: any) => response),
            retry(1),
            catchError(this.errService.errorHandl)
        );
    }
}
