import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';

export class DiagnosisDetails {
    name: string;
    deleted?: boolean;
}

export class DiagnosisLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class DiagnosesList {
    diagnoses: DiagnosisLookup[];
}

export class AddDiagnosisCommand {
    name: string;
}

export class UpdateDiagnosisCommand {
    id: number;
    name: string;
}

export class RestoreDiagnosisCommand {
    id: number;
}

export abstract class DiagnosisData {
    abstract GetDiagnosisDetails(id: number): Observable<DiagnosisDetails>;
    abstract GetDiagnoses(): Observable<DiagnosesList>;
    abstract GetDiagnosesDropdown(): Observable<SelectItemsList>;
    abstract AddDiagnosis(addDiagnosisCommand: AddDiagnosisCommand): Observable<Result>;
    abstract UpdateDiagnosis(updateDiagnosisCommand: UpdateDiagnosisCommand): Observable<Result>;
    abstract DeleteDiagnosis(id: number): Observable<Result>;
    abstract RestoreDiagnosis(restoreDiagnosisCommand: RestoreDiagnosisCommand): Observable<Result>;
}
