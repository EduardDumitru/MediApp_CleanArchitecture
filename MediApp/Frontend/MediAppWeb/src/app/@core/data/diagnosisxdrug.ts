import { SelectItemsList } from './common/selectitem';
import { Observable } from 'rxjs';
import { Result } from './common/result';

export class DiagnosisXDrugsLookup {
    id: number;
    diagnosisName: string;
    drugName: string;
    deleted?: boolean;
}

export class DiagnosisXDrugsList {
    diagnosisXDrugs: DiagnosisXDrugsLookup[];
}

export class AddDiagnosisXDrugCommand {
    diagnosisId: number;
    drugId: number;
}

export class RestoreDiagnosisXDrugCommand {
    id: number;
}

export abstract class DiagnosisData {
    abstract GetDiagnoses(): Observable<DiagnosisXDrugsList>;
    abstract GetDrugsByDiagnosisDropdown(): Observable<SelectItemsList>;
    abstract AddDiagnosisXDrug(addDiagnosisXDrugCommand: AddDiagnosisXDrugCommand): Observable<Result>;
    abstract DeleteDiagnosisXDrug(id: number): Observable<Result>;
    abstract RestoreDiagnosisXDrug(restoreDiagnosisXDrugCommand: RestoreDiagnosisXDrugCommand): Observable<Result>;
}
