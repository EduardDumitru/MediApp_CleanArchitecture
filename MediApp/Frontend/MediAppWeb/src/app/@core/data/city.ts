import { Result } from './common/result';
import { Observable } from 'rxjs/internal/Observable';
import { SelectItemsList } from './common/selectitem';

export class CityDetails {
    name: string;
    countyId: number;
    deleted?: boolean;
}

export class CitiesLookup {
    id: number;
    name: string;
    countyName: string;
    countryName: string;
    deleted?: boolean;
}

export class CitiesList {
    cities: CitiesLookup[];
}

export class AddCityCommand {
    name: string;
    countyId: number;
}

export class UpdateCityCommand {
    id: number;
    countyId: number;
    name: string;
}

export class RestoreCityCommand {
    id: number;
}

export abstract class CityData {
    abstract GetCityDetails(id: number): Observable<CityDetails>;
    abstract GetCities(): Observable<CitiesList>;
    abstract GetCitiesDropdown(): Observable<SelectItemsList>;
    abstract GetCitiesByCountyDropdown(countyId: number): Observable<SelectItemsList>;
    abstract GetCitiesByCountyFromEmployeesDropdown(countyId: number): Observable<SelectItemsList>;
    abstract AddCity(addCityCommand: AddCityCommand): Observable<Result>;
    abstract UpdateCity(updateCityCommand: UpdateCityCommand): Observable<Result>;
    abstract DeleteCity(id: number): Observable<Result>;
    abstract RestoreCity(restoreCityCommand: RestoreCityCommand): Observable<Result>;
}
