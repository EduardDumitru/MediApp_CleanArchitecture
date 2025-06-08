import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { Injectable } from '@angular/core';

export interface CountryDetails {
    name: string;
    deleted?: boolean;
}

export interface CountryLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class CountriesList {
    countries: CountryLookup[] = [];
}

export interface CountryFromEmployeesDropdownQuery {
    appointment: Date;
}

export interface AddCountryCommand {
    name: string;
}

export interface UpdateCountryCommand {
    id: number;
    name: string;
}

export interface RestoreCountryCommand {
    id: number;
}

@Injectable({
    providedIn: 'root'
})

export abstract class CountryData {
    abstract GetCountryDetails(id: number): Observable<CountryDetails>;
    abstract GetCountries(): Observable<CountriesList>;
    abstract GetCountriesDropdown(): Observable<SelectItemsList>;
    abstract GetCountriesFromEmployeesDropdown(countryDropdownQuery: CountryFromEmployeesDropdownQuery): Observable<SelectItemsList>;
    abstract AddCountry(addCountryCommand: AddCountryCommand): Observable<Result | null>;
    abstract UpdateCountry(updateCountryCommand: UpdateCountryCommand): Observable<Result | null>;
    abstract DeleteCountry(id: number): Observable<Result | null>;
    abstract RestoreCountry(restoreCountryCommand: RestoreCountryCommand): Observable<Result | null>;
}
