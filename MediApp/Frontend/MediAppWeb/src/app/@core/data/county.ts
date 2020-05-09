import { Result } from './common/result';
import { Observable } from 'rxjs/internal/Observable';
import { SelectItemsList } from './common/selectitem';

export class CountyDetails {
    name: string;
    countryId: number;
    deleted?: boolean;
}

export class CountiesLookup {
    id: number;
    name: string;
    countryName: string;
    deleted?: boolean;
}

export class CountiesList {
    Counties: CountiesLookup[];
}

export class AddCountyCommand {
    name: string;
    countyId: number;
}

export class UpdateCountyCommand {
    id: number;
    countyId: number;
    name: string;
}

export class RestoreCountyCommand {
    id: number;
}

export abstract class CountyData {
    abstract GetCountyDetails(id: number): Observable<CountyDetails>;
    abstract GetCounties(): Observable<CountiesList>;
    abstract GetCountiesDropdown(): Observable<SelectItemsList>;
    abstract GetCountiesByCountryDropdown(countryId: number): Observable<SelectItemsList>;
    abstract AddCounty(addCountyCommand: AddCountyCommand): Observable<Result>;
    abstract UpdateCounty(updateCountyCommand: UpdateCountyCommand): Observable<Result>;
    abstract DeleteCounty(id: number): Observable<Result>;
    abstract RestoreCounty(restoreCountyCommand: RestoreCountyCommand): Observable<Result>;
}
