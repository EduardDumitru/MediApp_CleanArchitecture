import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';

export class DrugDetails {
    name: string;
    deleted?: boolean;
}

export class DrugLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class DrugsList {
    drugs: DrugLookup[];
}

export class AddDrugCommand {
    name: string;
}

export class UpdateDrugCommand {
    id: number;
    name: string;
}

export class RestoreDrugCommand {
    id: number;
}

export abstract class DrugData {
    abstract GetDrugDetails(id: number): Observable<DrugDetails>;
    abstract GetDrugs(): Observable<DrugsList>;
    abstract GetDrugsDropdown(): Observable<SelectItemsList>;
    abstract AddDrug(addDrugCommand: AddDrugCommand): Observable<Result>;
    abstract UpdateDrug(updateDrugCommand: UpdateDrugCommand): Observable<Result>;
    abstract DeleteDrug(id: number): Observable<Result>;
    abstract RestoreDrug(restoreDrugCommand: RestoreDrugCommand): Observable<Result>;
}
