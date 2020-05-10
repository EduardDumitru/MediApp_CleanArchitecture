import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { EmployeeTypeDetails, EmployeeTypesList,
    AddEmployeeTypeCommand, UpdateEmployeeTypeCommand, RestoreEmployeeTypeCommand, EmployeeTypeData } from '../data/employeetype';
import { retry, catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';

@Injectable()
export class EmployeeTypeService extends EmployeeTypeData {
    baseUrl = environment.baseURL + 'employeetype';

    // Http Headers
    httpOptions = {
        headers: new HttpHeaders({
      'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {
        super();
    }

    GetEmployeeTypeDetails(id: number): Observable<EmployeeTypeDetails> {
        return this.http.get<EmployeeTypeDetails>(this.baseUrl + '/' + id)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetEmployeeTypes(): Observable<EmployeeTypesList> {
        return this.http.get<EmployeeTypesList>(this.baseUrl)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    GetEmployeeTypesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(this.baseUrl + '/employeetypesdropdown')
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    AddEmployeeType(addEmployeeTypeCommand: AddEmployeeTypeCommand): Observable<Result> {
        return this.http.post<Result>(this.baseUrl, JSON.stringify(addEmployeeTypeCommand), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.errorHandl)
            );
    }
    UpdateEmployeeType(updateEmployeeTypeCommand: UpdateEmployeeTypeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl, JSON.stringify(updateEmployeeTypeCommand), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    DeleteEmployeeType(id: number): Observable<Result> {
        return this.http.delete<Result>(this.baseUrl + '/' + id, this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.errorHandl)
        );
    }
    RestoreEmployeeType(restoreEmployeeTypeCommand: RestoreEmployeeTypeCommand): Observable<Result> {
        return this.http.put<Result>(this.baseUrl + '/restore', JSON.stringify(restoreEmployeeTypeCommand), this.httpOptions)
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
