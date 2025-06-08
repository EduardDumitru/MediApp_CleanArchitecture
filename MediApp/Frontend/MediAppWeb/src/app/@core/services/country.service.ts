import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
    CountryData,
    CountryDetails,
    CountriesList,
    AddCountryCommand,
    UpdateCountryCommand,
    RestoreCountryCommand,
    CountryFromEmployeesDropdownQuery
} from '../data/country';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class CountryService extends CountryData {
    private readonly baseUrl = `${environment.baseURL}Country`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);

    /**
     * Get details for a specific country
     * @param id Country ID
     * @returns Observable with country details
     */
    override GetCountryDetails(id: number): Observable<CountryDetails> {
        return this.http.get<CountryDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<CountryDetails>('GetCountryDetails', error, {} as CountryDetails))
        );
    }

    /**
     * Get all countries
     * @returns Observable with list of countries
     */
    override GetCountries(): Observable<CountriesList> {
        return this.http.get<CountriesList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<CountriesList>('GetCountries', error, new CountriesList()))
        );
    }

    /**
     * Get countries for dropdown
     * @returns Observable with select items list
     */
    override GetCountriesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/countriesdropdown`,
            this.apiHelper.getOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetCountriesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Get countries from employees for dropdown
     * @param countryDropdownQuery Query parameters
     * @returns Observable with select items list
     */
    override GetCountriesFromEmployeesDropdown(countryDropdownQuery: CountryFromEmployeesDropdownQuery): Observable<SelectItemsList> {
        return this.http.post<SelectItemsList>(
            `${this.baseUrl}/countriesdropdownfromemployees`,
            countryDropdownQuery,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetCountriesFromEmployeesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new country
     * @param addCountryCommand Country data
     * @returns Observable with result
     */
    override AddCountry(addCountryCommand: AddCountryCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addCountryCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddCountry', error, null))
        );
    }

    /**
     * Update an existing country
     * @param updateCountryCommand Country data
     * @returns Observable with result
     */
    override UpdateCountry(updateCountryCommand: UpdateCountryCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateCountryCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateCountry', error, null))
        );
    }

    /**
     * Delete a country
     * @param id Country ID
     * @returns Observable with result
     */
    override DeleteCountry(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteCountry', error, null))
        );
    }

    /**
     * Restore a previously deleted country
     * @param restoreCountryCommand Country restore command
     * @returns Observable with result
     */
    override RestoreCountry(restoreCountryCommand: RestoreCountryCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreCountryCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreCountry', error, null))
        );
    }
}