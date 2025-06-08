import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {
    DrugData,
    DrugDetails,
    DrugsList,
    AddDrugCommand,
    UpdateDrugCommand,
    RestoreDrugCommand
} from '../data/drug';
import { catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class DrugService extends DrugData {
    private readonly baseUrl = `${environment.baseURL}Drug`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific drug
     * @param id Drug ID
     * @returns Observable with drug details
     */
    override GetDrugDetails(id: number): Observable<DrugDetails> {
        return this.http.get<DrugDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<DrugDetails>('GetDrugDetails', error, {} as DrugDetails))
        );
    }

    /**
     * Get all drugs
     * @returns Observable with list of drugs
     */
    override GetDrugs(): Observable<DrugsList> {
        return this.http.get<DrugsList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<DrugsList>('GetDrugs', error, new DrugsList()))
        );
    }

    /**
     * Get drugs for dropdown
     * @returns Observable with select items list
     */
    override GetDrugsDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/drugsdropdown`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetDrugsDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new drug
     * @param addDrugCommand Drug data
     * @returns Observable with result
     */
    override AddDrug(addDrugCommand: AddDrugCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addDrugCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddDrug', error, null))
        );
    }

    /**
     * Update an existing drug
     * @param updateDrugCommand Drug data
     * @returns Observable with result
     */
    override UpdateDrug(updateDrugCommand: UpdateDrugCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateDrugCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateDrug', error, null))
        );
    }

    /**
     * Delete a drug
     * @param id Drug ID
     * @returns Observable with result
     */
    override DeleteDrug(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteDrug', error, null))
        );
    }

    /**
     * Restore a previously deleted drug
     * @param restoreDrugCommand Drug restore command
     * @returns Observable with result
     */
    override RestoreDrug(restoreDrugCommand: RestoreDrugCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreDrugCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreDrug', error, null))
        );
    }
}