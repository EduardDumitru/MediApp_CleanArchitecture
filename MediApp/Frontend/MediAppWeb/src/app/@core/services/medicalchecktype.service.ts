import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    MedicalCheckTypeData,
    MedicalCheckTypeDetails,
    MedicalCheckTypesList,
    AddMedicalCheckTypeCommand,
    UpdateMedicalCheckTypeCommand,
    RestoreMedicalCheckTypeCommand,
    MedicalCheckTypeFromClinicDropdownQuery
} from '../data/medicalchecktype';
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
export class MedicalCheckTypeService extends MedicalCheckTypeData {
    private readonly baseUrl = `${environment.baseURL}MedicalCheckType`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific medical check type
     * @param id Medical check type ID
     * @returns Observable with medical check type details
     */
    override GetMedicalCheckTypeDetails(id: number): Observable<MedicalCheckTypeDetails> {
        return this.http.get<MedicalCheckTypeDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<MedicalCheckTypeDetails>('GetMedicalCheckTypeDetails', error, {} as MedicalCheckTypeDetails))
        );
    }

    /**
     * Get all medical check types
     * @returns Observable with list of medical check types
     */
    override GetMedicalCheckTypes(): Observable<MedicalCheckTypesList> {
        return this.http.get<MedicalCheckTypesList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<MedicalCheckTypesList>('GetMedicalCheckTypes', error, new MedicalCheckTypesList()))
        );
    }

    /**
     * Get medical check types for dropdown
     * @returns Observable with select items list
     */
    override GetMedicalCheckTypesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/medicalchecktypesdropdown`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetMedicalCheckTypesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Get medical check types by clinic for dropdown
     * @param medicalCheckTypeDropdownQuery Query parameters
     * @returns Observable with select items list
     */
    override GetMedicalCheckTypesByClinicDropdown(medicalCheckTypeDropdownQuery: MedicalCheckTypeFromClinicDropdownQuery): Observable<SelectItemsList> {
        return this.http.post<SelectItemsList>(
            `${this.baseUrl}/medicalchecktypesbyclinicdropdown`,
            medicalCheckTypeDropdownQuery,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetMedicalCheckTypesByClinicDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new medical check type
     * @param addMedicalCheckTypeCommand Medical check type data
     * @returns Observable with result
     */
    override AddMedicalCheckType(addMedicalCheckTypeCommand: AddMedicalCheckTypeCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addMedicalCheckTypeCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddMedicalCheckType', error, null))
        );
    }

    /**
     * Update an existing medical check type
     * @param updateMedicalCheckTypeCommand Medical check type data
     * @returns Observable with result
     */
    override UpdateMedicalCheckType(updateMedicalCheckTypeCommand: UpdateMedicalCheckTypeCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateMedicalCheckTypeCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateMedicalCheckType', error, null))
        );
    }

    /**
     * Delete a medical check type
     * @param id Medical check type ID
     * @returns Observable with result
     */
    override DeleteMedicalCheckType(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteMedicalCheckType', error, null))
        );
    }

    /**
     * Restore a previously deleted medical check type
     * @param restoreMedicalCheckTypeCommand Medical check type restore command
     * @returns Observable with result
     */
    override RestoreMedicalCheckType(restoreMedicalCheckTypeCommand: RestoreMedicalCheckTypeCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreMedicalCheckTypeCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreMedicalCheckType', error, null))
        );
    }
}