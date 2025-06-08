import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { Injectable } from '@angular/core';

export interface DrugDetails {
    name: string;
    deleted?: boolean;
}

export interface DrugLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class DrugsList {
    drugs: DrugLookup[] = [];
}

export interface AddDrugCommand {
    name: string;
}

export interface UpdateDrugCommand {
    id: number;
    name: string;
}

export interface RestoreDrugCommand {
    id: number;
}

@Injectable({
    providedIn: 'root'
})

export abstract class DrugData {
    abstract GetDrugDetails(id: number): Observable<DrugDetails>;
    abstract GetDrugs(): Observable<DrugsList>;
    abstract GetDrugsDropdown(): Observable<SelectItemsList>;
    abstract AddDrug(addDrugCommand: AddDrugCommand): Observable<Result | null>;
    abstract UpdateDrug(updateDrugCommand: UpdateDrugCommand): Observable<Result | null>;
    abstract DeleteDrug(id: number): Observable<Result | null>;
    abstract RestoreDrug(restoreDrugCommand: RestoreDrugCommand): Observable<Result | null>;
}
