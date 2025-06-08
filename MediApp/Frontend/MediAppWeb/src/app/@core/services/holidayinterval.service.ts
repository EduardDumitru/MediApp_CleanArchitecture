import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    HolidayIntervalData,
    HolidayIntervalDetails,
    HolidayIntervalsList,
    AddHolidayIntervalCommand,
    UpdateHolidayIntervalCommand,
    RestoreHolidayIntervalCommand
} from '../data/holidayinterval';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class HolidayIntervalService extends HolidayIntervalData {
    private readonly baseUrl = `${environment.baseURL}HolidayInterval`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific holiday interval
     * @param id Holiday interval ID
     * @returns Observable with holiday interval details
     */
    override GetHolidayIntervalDetails(id: number): Observable<HolidayIntervalDetails> {
        return this.http.get<HolidayIntervalDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<HolidayIntervalDetails>('GetHolidayIntervalDetails', error, {} as HolidayIntervalDetails))
        );
    }

    /**
     * Get all holiday intervals
     * @returns Observable with list of holiday intervals
     */
    override GetHolidayIntervals(): Observable<HolidayIntervalsList> {
        return this.http.get<HolidayIntervalsList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<HolidayIntervalsList>('GetHolidayIntervals', error, new HolidayIntervalsList()))
        );
    }

    /**
     * Get holiday intervals by clinic
     * @param clinicId Clinic ID
     * @returns Observable with list of holiday intervals
     */
    override GetHolidayIntervalsByClinic(clinicId: number): Observable<HolidayIntervalsList> {
        return this.http.get<HolidayIntervalsList>(
            `${this.baseUrl}/byclinic/${clinicId}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<HolidayIntervalsList>('GetHolidayIntervalsByClinic', error, new HolidayIntervalsList()))
        );
    }

    /**
     * Add a new holiday interval
     * @param addHolidayIntervalCommand Holiday interval data
     * @returns Observable with result
     */
    override AddHolidayInterval(addHolidayIntervalCommand: AddHolidayIntervalCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addHolidayIntervalCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddHolidayInterval', error, null))
        );
    }

    /**
     * Update an existing holiday interval
     * @param updateHolidayIntervalCommand Holiday interval data
     * @returns Observable with result
     */
    override UpdateHolidayInterval(updateHolidayIntervalCommand: UpdateHolidayIntervalCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateHolidayIntervalCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateHolidayInterval', error, null))
        );
    }

    /**
     * Delete a holiday interval
     * @param id Holiday interval ID
     * @returns Observable with result
     */
    override DeleteHolidayInterval(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteHolidayInterval', error, null))
        );
    }

    /**
     * Restore a previously deleted holiday interval
     * @param restoreHolidayIntervalCommand Holiday interval restore command
     * @returns Observable with result
     */
    override RestoreHolidayInterval(restoreHolidayIntervalCommand: RestoreHolidayIntervalCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreHolidayIntervalCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreHolidayInterval', error, null))
        );
    }
}