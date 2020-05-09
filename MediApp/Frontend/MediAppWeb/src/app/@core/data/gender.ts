import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';

export class GenderDetails {
    name: string;
    deleted?: boolean;
}

export class GenderLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class GendersList {
    genders: GenderLookup[];
}

export class AddGenderCommand {
    name: string;
}

export class UpdateGenderCommand {
    id: number;
    name: string;
}

export class RestoreGenderCommand {
    id: number;
}

export abstract class GenderData {
    abstract GetGenderDetails(id: number): Observable<GenderDetails>;
    abstract GetGenders(): Observable<GendersList>;
    abstract GetGendersDropdown(): Observable<SelectItemsList>;
    abstract AddGender(addGenderCommand: AddGenderCommand): Observable<Result>;
    abstract UpdateGender(updateGenderCommand: UpdateGenderCommand): Observable<Result>;
    abstract DeleteGender(id: number): Observable<Result>;
    abstract RestoreGender(restoreGenderCommand: RestoreGenderCommand): Observable<Result>;
}
