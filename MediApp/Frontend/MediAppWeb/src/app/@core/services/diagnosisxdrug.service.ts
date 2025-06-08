import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    DiagnosisXDrugData,
    AddDiagnosisXDrugCommand,
    RestoreDiagnosisXDrugCommand,
    DiagnosisXDrugsList
} from '../data/diagnosisxdrug';
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
export class DiagnosisXDrugService extends DiagnosisXDrugData {
    private readonly baseUrl = `${environment.baseURL}DiagnosisXDrug`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get all diagnosis x drug mappings
     * @returns Observable with list of diagnosis x drug mappings
     */
    override GetDiagnosisXDrugs(): Observable<DiagnosisXDrugsList> {
        return this.http.get<DiagnosisXDrugsList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<DiagnosisXDrugsList>('GetDiagnosisXDrugs', error, new DiagnosisXDrugsList()))
        );
    }

    /**
     * Get drugs by diagnosis for dropdown
     * @param diagnosisId Diagnosis ID
     * @returns Observable with select items list
     */
    override GetDrugsByDiagnosisDropdown(diagnosisId: number): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/drugsbydiagnosesdropdown/${diagnosisId}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetDrugsByDiagnosisDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new diagnosis x drug mapping
     * @param addDiagnosisXDrugCommand Diagnosis x drug data
     * @returns Observable with result
     */
    override AddDiagnosisXDrug(addDiagnosisXDrugCommand: AddDiagnosisXDrugCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addDiagnosisXDrugCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddDiagnosisXDrug', error, null))
        );
    }

    /**
     * Delete a diagnosis x drug mapping
     * @param id Diagnosis x drug ID
     * @returns Observable with result
     */
    override DeleteDiagnosisXDrug(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteDiagnosisXDrug', error, null))
        );
    }

    /**
     * Restore a previously deleted diagnosis x drug mapping
     * @param restoreDiagnosisXDrugCommand Diagnosis x drug restore command
     * @returns Observable with result
     */
    override RestoreDiagnosisXDrug(restoreDiagnosisXDrugCommand: RestoreDiagnosisXDrugCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreDiagnosisXDrugCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreDiagnosisXDrug', error, null))
        );
    }
}