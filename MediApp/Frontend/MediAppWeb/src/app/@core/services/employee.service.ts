import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    EmployeeData,
    EmployeeDetails,
    EmployeesList,
    AddEmployeeCommand,
    UpdateEmployeeCommand,
    RestoreEmployeeCommand,
    EmployeeDropdownQuery
} from '../data/employee';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService extends EmployeeData {
    private readonly baseUrl = `${environment.baseURL}Employee`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific employee
     * @param id Employee ID
     * @returns Observable with employee details
     */
    override GetEmployeeDetails(id: number): Observable<EmployeeDetails> {
        return this.http.get<EmployeeDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<EmployeeDetails>('GetEmployeeDetails', error, {} as EmployeeDetails))
        );
    }

    /**
     * Get employee details for the current user
     * @returns Observable with employee details
     */
    override GetEmployeeDetailsByCurrentUser(): Observable<EmployeeDetails> {
        return this.http.get<EmployeeDetails>(
            `${this.baseUrl}/bycurrentuser`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<EmployeeDetails>('GetEmployeeDetailsByCurrentUser', error, {} as EmployeeDetails))
        );
    }

    /**
     * Get all employees
     * @returns Observable with list of employees
     */
    override GetEmployees(): Observable<EmployeesList> {
        return this.http.get<EmployeesList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<EmployeesList>('GetEmployees', error, new EmployeesList()))
        );
    }

    /**
     * Get filtered employees for dropdown
     * @param employeeDropdownQuery Query parameters
     * @returns Observable with select items list
     */
    override GetEmployeesDropdown(employeeDropdownQuery: EmployeeDropdownQuery): Observable<SelectItemsList> {
        return this.http.post<SelectItemsList>(
            `${this.baseUrl}/employeesdropdown`,
            employeeDropdownQuery,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetEmployeesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Get all employees for dropdown
     * @returns Observable with select items list
     */
    override GetAllEmployeesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/employeesdropdown`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetAllEmployeesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new employee
     * @param addEmployeeCommand Employee data
     * @returns Observable with result
     */
    override AddEmployee(addEmployeeCommand: AddEmployeeCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addEmployeeCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddEmployee', error, null))
        );
    }

    /**
     * Update an existing employee
     * @param updateEmployeeCommand Employee data
     * @returns Observable with result
     */
    override UpdateEmployee(updateEmployeeCommand: UpdateEmployeeCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateEmployeeCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateEmployee', error, null))
        );
    }

    /**
     * Delete an employee
     * @param id Employee ID
     * @returns Observable with result
     */
    override DeleteEmployee(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteEmployee', error, null))
        );
    }

    /**
     * Restore a previously deleted employee
     * @param restoreEmployeeCommand Employee restore command
     * @returns Observable with result
     */
    override RestoreEmployee(restoreEmployeeCommand: RestoreEmployeeCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreEmployeeCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreEmployee', error, null))
        );
    }
}