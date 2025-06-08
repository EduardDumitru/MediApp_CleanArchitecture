import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {
    EmployeeTypeData,
    EmployeeTypeDetails,
    EmployeeTypesList,
    AddEmployeeTypeCommand,
    UpdateEmployeeTypeCommand,
    RestoreEmployeeTypeCommand
} from '../data/employeetype';
import { catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class EmployeeTypeService extends EmployeeTypeData {
    private readonly baseUrl = `${environment.baseURL}EmployeeType`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific employee type
     * @param id Employee type ID
     * @returns Observable with employee type details
     */
    override GetEmployeeTypeDetails(id: number): Observable<EmployeeTypeDetails> {
        return this.http.get<EmployeeTypeDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<EmployeeTypeDetails>('GetEmployeeTypeDetails', error, {} as EmployeeTypeDetails))
        );
    }

    /**
     * Get all employee types
     * @returns Observable with list of employee types
     */
    override GetEmployeeTypes(): Observable<EmployeeTypesList> {
        return this.http.get<EmployeeTypesList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<EmployeeTypesList>('GetEmployeeTypes', error, new EmployeeTypesList()))
        );
    }

    /**
     * Get employee types for dropdown
     * @returns Observable with select items list
     */
    override GetEmployeeTypesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/employeetypesdropdown`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetEmployeeTypesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new employee type
     * @param addEmployeeTypeCommand Employee type data
     * @returns Observable with result
     */
    override AddEmployeeType(addEmployeeTypeCommand: AddEmployeeTypeCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addEmployeeTypeCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddEmployeeType', error, null))
        );
    }

    /**
     * Update an existing employee type
     * @param updateEmployeeTypeCommand Employee type data
     * @returns Observable with result
     */
    override UpdateEmployeeType(updateEmployeeTypeCommand: UpdateEmployeeTypeCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateEmployeeTypeCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateEmployeeType', error, null))
        );
    }

    /**
     * Delete an employee type
     * @param id Employee type ID
     * @returns Observable with result
     */
    override DeleteEmployeeType(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteEmployeeType', error, null))
        );
    }

    /**
     * Restore a previously deleted employee type
     * @param restoreEmployeeTypeCommand Employee type restore command
     * @returns Observable with result
     */
    override RestoreEmployeeType(restoreEmployeeTypeCommand: RestoreEmployeeTypeCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreEmployeeTypeCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreEmployeeType', error, null))
        );
    }
}