import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
    CityData,
    CityDetails,
    CitiesList,
    AddCityCommand,
    UpdateCityCommand,
    RestoreCityCommand,
    CityFromEmployeesDropdownQuery
} from '../data/city';
import { Observable } from 'rxjs';
import { SelectItemsList } from '../data/common/selectitem';
import { Result } from '../data/common/result';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from 'src/app/shared/error.service';
import { ApiHelper } from './api.helper';

@Injectable({
    providedIn: 'root'
})
export class CityService extends CityData {
    private readonly baseUrl = `${environment.baseURL}City`;

    // Modern dependency injection using inject function
    private readonly http = inject(HttpClient);
    private readonly errorService = inject(ErrorService);
    private readonly apiHelper = inject(ApiHelper);


    /**
     * Get details for a specific city
     * @param id City ID
     * @returns Observable with city details
     */
    override GetCityDetails(id: number): Observable<CityDetails> {
        return this.http.get<CityDetails>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<CityDetails>('getCityDetails', error, {} as CityDetails))
        );
    }

    /**
     * Get all cities
     * @returns Observable with list of cities
     */
    override GetCities(): Observable<CitiesList> {
        return this.http.get<CitiesList>(
            this.baseUrl,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<CitiesList>('GetCities', error, new CitiesList()))
        );
    }

    /**
     * Get cities for dropdown
     * @returns Observable with select items list
     */
    override GetCitiesDropdown(): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/citiesdropdown`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetCitiesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Get cities by county for dropdown
     * @param countyId County ID
     * @returns Observable with select items list
     */
    override GetCitiesByCountyDropdown(countyId: number): Observable<SelectItemsList> {
        return this.http.get<SelectItemsList>(
            `${this.baseUrl}/citiesdropdown/${countyId}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetCitiesByCountyDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Get cities by county from employees for dropdown
     * @param cityDropdownQuery Query parameters
     * @returns Observable with select items list
     */
    override GetCitiesByCountyFromEmployeesDropdown(cityDropdownQuery: CityFromEmployeesDropdownQuery): Observable<SelectItemsList> {
        return this.http.post<SelectItemsList>(
            `${this.baseUrl}/citiesdropdownfromemployees`,
            cityDropdownQuery,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<SelectItemsList>('GetCitiesByCountyFromEmployeesDropdown', error, new SelectItemsList()))
        );
    }

    /**
     * Add a new city
     * @param addCityCommand City data
     * @returns Observable with result
     */
    override AddCity(addCityCommand: AddCityCommand): Observable<Result | null> {
        return this.http.post<Result>(
            this.baseUrl,
            addCityCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('AddCity', error, null))
        );
    }

    /**
     * Update an existing city
     * @param updateCityCommand City data
     * @returns Observable with result
     */
    override UpdateCity(updateCityCommand: UpdateCityCommand): Observable<Result | null> {
        return this.http.put<Result>(
            this.baseUrl,
            updateCityCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('UpdateCity', error, null))
        );
    }

    /**
     * Delete a city
     * @param id City ID
     * @returns Observable with result
     */
    override DeleteCity(id: number): Observable<Result | null> {
        return this.http.delete<Result>(
            `${this.baseUrl}/${id}`,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('DeleteCity', error, null))
        );
    }

    /**
     * Restore a previously deleted city
     * @param restoreCityCommand City restore command
     * @returns Observable with result
     */
    override RestoreCity(restoreCityCommand: RestoreCityCommand): Observable<Result | null> {
        return this.http.put<Result>(
            `${this.baseUrl}/restore`,
            restoreCityCommand,
            this.apiHelper.getAuthOptions()
        ).pipe(
            catchError(error => this.errorService.handleError<Result | null>('RestoreCity', error, null))
        );
    }
}