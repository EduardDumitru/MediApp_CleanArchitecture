import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { Injectable } from '@angular/core';

export interface DiagnosisDetails {
    name: string;
    deleted?: boolean;
}

export interface DiagnosisLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class DiagnosesList {
    diagnoses: DiagnosisLookup[] = [];
}

export interface AddDiagnosisCommand {
    name: string;
}

export interface UpdateDiagnosisCommand {
    id: number;
    name: string;
}

export interface RestoreDiagnosisCommand {
    id: number;
}

@Injectable({
    providedIn: 'root'
})

export abstract class DiagnosisData {
    abstract GetDiagnosisDetails(id: number): Observable<DiagnosisDetails>;
    abstract GetDiagnoses(): Observable<DiagnosesList>;
    abstract GetDiagnosesDropdown(): Observable<SelectItemsList>;
    abstract AddDiagnosis(addDiagnosisCommand: AddDiagnosisCommand): Observable<Result | null>;
    abstract UpdateDiagnosis(updateDiagnosisCommand: UpdateDiagnosisCommand): Observable<Result | null>;
    abstract DeleteDiagnosis(id: number): Observable<Result | null>;
    abstract RestoreDiagnosis(restoreDiagnosisCommand: RestoreDiagnosisCommand): Observable<Result | null>;
}
