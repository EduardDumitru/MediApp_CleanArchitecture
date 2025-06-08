import { Result } from './common/result';
import { Observable } from 'rxjs/internal/Observable';
import { SelectItemsList } from './common/selectitem';
import { Injectable } from '@angular/core';

export interface CountyDetails {
    name: string;
    countryId: number;
    deleted?: boolean;
}

export interface CountiesLookup {
    id: number;
    name: string;
    countryName: string;
    deleted?: boolean;
}

export class CountiesList {
    counties: CountiesLookup[] = [];
}

export interface AddCountyCommand {
    name: string;
    countryId: number;
}

export interface UpdateCountyCommand {
    id: number;
    countryId: number;
    name: string;
}

export interface RestoreCountyCommand {
    id: number;
}

export interface CountyFromEmployeesDropdownQuery {
    countryId: number;
    appointment: Date;
}

@Injectable({
    providedIn: 'root'
})

export abstract class CountyData {
    abstract GetCountyDetails(id: number): Observable<CountyDetails>;
    abstract GetCounties(): Observable<CountiesList>;
    abstract GetCountiesDropdown(): Observable<SelectItemsList>;
    abstract GetCountiesByCountryDropdown(countryId: number): Observable<SelectItemsList>;
    abstract GetCountiesByCountryFromEmployeesDropdown(countyDropdownQuery: CountyFromEmployeesDropdownQuery): Observable<SelectItemsList>;
    abstract AddCounty(addCountyCommand: AddCountyCommand): Observable<Result | null>;
    abstract UpdateCounty(updateCountyCommand: UpdateCountyCommand): Observable<Result | null>;
    abstract DeleteCounty(id: number): Observable<Result | null>;
    abstract RestoreCounty(restoreCountyCommand: RestoreCountyCommand): Observable<Result | null>;
}
