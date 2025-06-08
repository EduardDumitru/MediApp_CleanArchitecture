import { SelectItemsList } from './common/selectitem';
import { Observable } from 'rxjs';
import { Result } from './common/result';
import { Injectable } from '@angular/core';

export interface DiagnosisXDrugsLookup {
    id: number;
    diagnosisName: string;
    drugName: string;
    deleted?: boolean;
}

export class DiagnosisXDrugsList {
    diagnosisXDrugs: DiagnosisXDrugsLookup[] = [];
}

export interface AddDiagnosisXDrugCommand {
    diagnosisId: number;
    drugId: number;
}

export interface RestoreDiagnosisXDrugCommand {
    id: number;
}

@Injectable({
    providedIn: 'root'
})

export abstract class DiagnosisXDrugData {
    abstract GetDiagnosisXDrugs(): Observable<DiagnosisXDrugsList>;
    abstract GetDrugsByDiagnosisDropdown(diagnosisId: number): Observable<SelectItemsList>;
    abstract AddDiagnosisXDrug(addDiagnosisXDrugCommand: AddDiagnosisXDrugCommand): Observable<Result | null>;
    abstract DeleteDiagnosisXDrug(id: number): Observable<Result | null>;
    abstract RestoreDiagnosisXDrug(restoreDiagnosisXDrugCommand: RestoreDiagnosisXDrugCommand): Observable<Result | null>;
}
