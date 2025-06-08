import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    PrescriptionXDrugData,
    PrescriptionXDrugsList,
    AddPrescriptionXDrugCommand,
    UpdatePrescriptionXDrugCommand,
    PrescriptionXDrugDetails
} from '../data/prescriptionxdrug';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class PrescriptionXDrugService extends PrescriptionXDrugData {
    private readonly baseUrl = `${environment.baseURL}PrescriptionXDrug`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get prescription x drugs by prescription
     * @param prescriptionId Prescription ID
     * @returns Observable with list of prescription x drugs
     */
    override GetPrescriptionXDrugs(prescriptionId: number): Observable<PrescriptionXDrugsList> {
        return this.http.get<PrescriptionXDrugsList>(
            `${this.baseUrl}/drugsbyprescription/${prescriptionId}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<PrescriptionXDrugsList>('GetPrescriptionXDrugs', error, new PrescriptionXDrugsList()))
        );
    }

    /**
     * Get details for a specific prescription x drug
     * @param id Prescription x drug ID
     * @returns Observable with prescription x drug details
     */
    override GetPrescriptionXDrug(id: number): Observable<PrescriptionXDrugDetails> {
        return this.http.get<PrescriptionXDrugDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<PrescriptionXDrugDetails>('GetPrescriptionXDrug', error, {} as PrescriptionXDrugDetails))
        );
    }

    /**
     * Add a new prescription x drug mapping
     * @param addPrescriptionXDrugCommand Prescription x drug data
     * @returns Observable with result
     */
    override AddPrescriptionXDrug(addPrescriptionXDrugCommand: AddPrescriptionXDrugCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addPrescriptionXDrugCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddPrescriptionXDrug', error, null))
        );
    }

    /**
     * Delete a prescription x drug mapping
     * @param id Prescription x drug ID
     * @returns Observable with result
     */
    override DeletePrescriptionXDrug(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeletePrescriptionXDrug', error, null))
        );
    }

    /**
     * Update an existing prescription x drug mapping
     * @param updatePrescriptionXDrugCommand Prescription x drug data
     * @returns Observable with result
     */
    override UpdatePrescriptionXDrug(updatePrescriptionXDrugCommand: UpdatePrescriptionXDrugCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updatePrescriptionXDrugCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdatePrescriptionXDrug', error, null))
        );
    }
}