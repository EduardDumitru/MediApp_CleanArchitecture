import { Result } from './common/result';
import { Observable } from 'rxjs/internal/Observable';
import { SelectItemsList } from './common/selectitem';
import { Injectable } from '@angular/core';

export interface CityDetails {
    name: string;
    countyId: number;
    deleted?: boolean;
}

export interface CitiesLookup {
    id: number;
    name: string;
    countyName: string;
    countryName: string;
    deleted?: boolean;
}

export class CitiesList {
    cities: CitiesLookup[] = [];
}

export interface AddCityCommand {
    name: string;
    countyId: number;
}

export interface UpdateCityCommand {
    id: number;
    countyId: number;
    name: string;
}

export interface RestoreCityCommand {
    id: number;
}

export interface CityFromEmployeesDropdownQuery {
    countyId: number;
    appointment: Date;
}

@Injectable({
    providedIn: 'root'
})

export abstract class CityData {
    abstract GetCityDetails(id: number): Observable<CityDetails>;
    abstract GetCities(): Observable<CitiesList>;
    abstract GetCitiesDropdown(): Observable<SelectItemsList>;
    abstract GetCitiesByCountyDropdown(countyId: number): Observable<SelectItemsList>;
    abstract GetCitiesByCountyFromEmployeesDropdown(cityDropdownQuery: CityFromEmployeesDropdownQuery): Observable<SelectItemsList>;
    abstract AddCity(addCityCommand: AddCityCommand): Observable<Result | null>;
    abstract UpdateCity(updateCityCommand: UpdateCityCommand): Observable<Result | null>;
    abstract DeleteCity(id: number): Observable<Result | null>;
    abstract RestoreCity(restoreCityCommand: RestoreCityCommand): Observable<Result | null>;
}
