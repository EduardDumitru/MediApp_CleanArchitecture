import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';

export class CountryDetails {
    name: string;
    deleted?: boolean;
}

export class CountryLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class CountriesList {
    countries: CountryLookup[];
}

export class CountryFromEmployeesDropdownQuery {
    appointment: Date;
}

export class AddCountryCommand {
    name: string;
}

export class UpdateCountryCommand {
    id: number;
    name: string;
}

export class RestoreCountryCommand {
    id: number;
}

export abstract class CountryData {
    abstract GetCountryDetails(id: number): Observable<CountryDetails>;
    abstract GetCountries(): Observable<CountriesList>;
    abstract GetCountriesDropdown(): Observable<SelectItemsList>;
    abstract GetCountriesFromEmployeesDropdown(countryDropdownQuery: CountryFromEmployeesDropdownQuery): Observable<SelectItemsList>;
    abstract AddCountry(addCountryCommand: AddCountryCommand): Observable<Result>;
    abstract UpdateCountry(updateCountryCommand: UpdateCountryCommand): Observable<Result>;
    abstract DeleteCountry(id: number): Observable<Result>;
    abstract RestoreCountry(restoreCountryCommand: RestoreCountryCommand): Observable<Result>;
}
