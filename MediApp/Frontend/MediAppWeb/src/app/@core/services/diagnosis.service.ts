import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    DiagnosisData,
    DiagnosisDetails,
    AddDiagnosisCommand,
    UpdateDiagnosisCommand,
    RestoreDiagnosisCommand,
    DiagnosesList
} from '../data/diagnosis';
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
export class DiagnosisService extends DiagnosisData {
    private readonly baseUrl = `${environment.baseURL}Diagnosis`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific diagnosis
     * @param id Diagnosis ID
     * @returns Observable with diagnosis details
     */
    override GetDiagnosisDetails(id: number): Observable<DiagnosisDetails> {
        return this.http.get<DiagnosisDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<DiagnosisDetails>('GetDiagnosisDetails', error, {} as DiagnosisDetails))
        );
    }

    /**
     * Get all diagnoses
     * @returns Observable with list of diagnoses
     */
    override GetDiagnoses(): Observable<DiagnosesList> {
        return this.http.get<DiagnosesList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<DiagnosesList>('GetDiagnoses', error, new DiagnosesList()))
        );
    }

    /**
     * Get diagnoses for dropdown
     * @returns Observable with select items list
     */
    override GetDiagnosesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/diagnosesdropdown`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetDiagnosesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new diagnosis
     * @param addDiagnosisCommand Diagnosis data
     * @returns Observable with result
     */
    override AddDiagnosis(addDiagnosisCommand: AddDiagnosisCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addDiagnosisCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddDiagnosis', error, null))
        );
    }

    /**
     * Update an existing diagnosis
     * @param updateDiagnosisCommand Diagnosis data
     * @returns Observable with result
     */
    override UpdateDiagnosis(updateDiagnosisCommand: UpdateDiagnosisCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateDiagnosisCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateDiagnosis', error, null))
        );
    }

    /**
     * Delete a diagnosis
     * @param id Diagnosis ID
     * @returns Observable with result
     */
    override DeleteDiagnosis(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteDiagnosis', error, null))
        );
    }

    /**
     * Restore a previously deleted diagnosis
     * @param restoreDiagnosisCommand Diagnosis restore command
     * @returns Observable with result
     */
    override RestoreDiagnosis(restoreDiagnosisCommand: RestoreDiagnosisCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreDiagnosisCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreDiagnosis', error, null))
        );
    }
}