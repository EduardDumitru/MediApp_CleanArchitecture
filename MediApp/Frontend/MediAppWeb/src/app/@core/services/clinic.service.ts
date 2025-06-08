import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
    ClinicData,
    ClinicDetails,
    ClinicsList,
    AddClinicCommand,
    UpdateClinicCommand,
    RestoreClinicCommand
} from '../data/clinic';
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
export class ClinicService extends ClinicData {
    private readonly baseUrl = `${environment.baseURL}Clinic`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific clinic
     * @param id Clinic ID
     * @returns Observable with clinic details
     */
    override GetClinicDetails(id: number): Observable<ClinicDetails> {
        return this.http.get<ClinicDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<ClinicDetails>('GetClinicDetails', error, {} as ClinicDetails))
        );
    }

    /**
     * Get all clinics
     * @returns Observable with list of clinics
     */
    override GetClinics(): Observable<ClinicsList> {
        return this.http.get<ClinicsList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<ClinicsList>('GetClinics', error, new ClinicsList()))
        );
    }

    /**
     * Get clinics for dropdown
     * @param countryId Optional country ID filter
     * @param countyId Optional county ID filter
     * @param cityId Optional city ID filter
     * @returns Observable with select items list
     */
    override GetClinicsDropdown(countryId?: number, countyId?: number, cityId?: number): Observable<SelectItemsList> {
        const params = new HttpParams({
            fromObject: {
                countryId: countryId ? countryId.toString() : '',
                countyId: countyId ? countyId.toString() : '',
                cityId: cityId ? cityId.toString() : ''
            }
        });

        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/clinicsdropdown`,
            {
                ...this.apiHelper.getAuthOptions(),
                params
            }
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetClinicsDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new clinic
     * @param addClinicCommand Clinic data
     * @returns Observable with result
     */
    override AddClinic(addClinicCommand: AddClinicCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addClinicCommand, // Angular HttpClient automatically serializes objects
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddClinic', error, null))
        );
    }

    /**
     * Update an existing clinic
     * @param updateClinicCommand Clinic data
     * @returns Observable with result
     */
    override UpdateClinic(updateClinicCommand: UpdateClinicCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateClinicCommand, // Angular HttpClient automatically serializes objects
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateClinic', error, null))
        );
    }

    /**
     * Delete a clinic
     * @param id Clinic ID
     * @returns Observable with result
     */
    override DeleteClinic(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteClinic', error, null))
        );
    }

    /**
     * Restore a previously deleted clinic
     * @param restoreClinicCommand Clinic restore command
     * @returns Observable with result
     */
    override RestoreClinic(restoreClinicCommand: RestoreClinicCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreClinicCommand, // Angular HttpClient automatically serializes objects
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreClinic', error, null))
        );
    }
}