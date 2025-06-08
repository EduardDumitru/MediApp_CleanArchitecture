import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    CountyData,
    CountyDetails,
    CountiesList,
    AddCountyCommand,
    UpdateCountyCommand,
    RestoreCountyCommand,
    CountyFromEmployeesDropdownQuery
} from '../data/county';
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
export class CountyService extends CountyData {
    private readonly baseUrl = `${environment.baseURL}County`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific county
     * @param id County ID
     * @returns Observable with county details
     */
    override GetCountyDetails(id: number): Observable<CountyDetails> {
        return this.http.get<CountyDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<CountyDetails>('GetCountyDetails', error, {} as CountyDetails))
        );
    }

    /**
     * Get all counties
     * @returns Observable with list of counties
     */
    override GetCounties(): Observable<CountiesList> {
        return this.http.get<CountiesList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<CountiesList>('GetCounties', error, new CountiesList()))
        );
    }

    /**
     * Get counties for dropdown
     * @returns Observable with select items list
     */
    override GetCountiesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/countiesdropdown`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetCountiesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Get counties by country for dropdown
     * @param countryId Country ID
     * @returns Observable with select items list
     */
    override GetCountiesByCountryDropdown(countryId: number): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/countiesdropdown/${countryId}`,
            this.apiHelper.getOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetCountiesByCountryDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Get counties by country from employees for dropdown
     * @param countyDropdownQuery Query parameters
     * @returns Observable with select items list
     */
    override GetCountiesByCountryFromEmployeesDropdown(countyDropdownQuery: CountyFromEmployeesDropdownQuery): Observable<SelectItemsList> {
        return this.http.post<SelectItemsList>(
            `${this.baseUrl}/countiesdropdownfromemployees`,
            countyDropdownQuery,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetCountiesByCountryFromEmployeesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new county
     * @param addCountyCommand County data
     * @returns Observable with result
     */
    override AddCounty(addCountyCommand: AddCountyCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addCountyCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddCounty', error, null))
        );
    }

    /**
     * Update an existing county
     * @param updateCountyCommand County data
     * @returns Observable with result
     */
    override UpdateCounty(updateCountyCommand: UpdateCountyCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateCountyCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateCounty', error, null))
        );
    }

    /**
     * Delete a county
     * @param id County ID
     * @returns Observable with result
     */
    override DeleteCounty(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteCounty', error, null))
        );
    }

    /**
     * Restore a previously deleted county
     * @param restoreCountyCommand County restore command
     * @returns Observable with result
     */
    override RestoreCounty(restoreCountyCommand: RestoreCountyCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreCountyCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreCounty', error, null))
        );
    }
}