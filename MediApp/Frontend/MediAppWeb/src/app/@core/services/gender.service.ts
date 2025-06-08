import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {
    GenderData,
    GenderDetails,
    GendersList,
    AddGenderCommand,
    UpdateGenderCommand,
    RestoreGenderCommand
} from '../data/gender';
import { catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class GenderService extends GenderData {
    private readonly baseUrl = `${environment.baseURL}Gender`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific gender
     * @param id Gender ID
     * @returns Observable with gender details
     */
    override GetGenderDetails(id: number): Observable<GenderDetails> {
        return this.http.get<GenderDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<GenderDetails>('GetGenderDetails', error, {} as GenderDetails))
        );
    }

    /**
     * Get all genders
     * @returns Observable with list of genders
     */
    override GetGenders(): Observable<GendersList> {
        return this.http.get<GendersList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<GendersList>('GetGenders', error, new GendersList()))
        );
    }

    /**
     * Get genders for dropdown
     * @returns Observable with select items list
     */
    override GetGendersDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/gendersdropdown`,
            this.apiHelper.getOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetGendersDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new gender
     * @param addGenderCommand Gender data
     * @returns Observable with result
     */
    override AddGender(addGenderCommand: AddGenderCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addGenderCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddGender', error, null))
        );
    }

    /**
     * Update an existing gender
     * @param updateGenderCommand Gender data
     * @returns Observable with result
     */
    override UpdateGender(updateGenderCommand: UpdateGenderCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateGenderCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateGender', error, null))
        );
    }

    /**
     * Delete a gender
     * @param id Gender ID
     * @returns Observable with result
     */
    override DeleteGender(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteGender', error, null))
        );
    }

    /**
     * Restore a previously deleted gender
     * @param restoreGenderCommand Gender restore command
     * @returns Observable with result
     */
    override RestoreGender(restoreGenderCommand: RestoreGenderCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreGenderCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreGender', error, null))
        );
    }
}