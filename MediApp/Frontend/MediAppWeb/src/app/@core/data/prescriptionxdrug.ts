import { SelectItemsList } from './common/selectitem';
import { Observable } from 'rxjs';
import { Result } from './common/result';
import { TimeSpan } from './common/timespan';

export class PrescriptionXDrugsLookup {
    drugName: string;
    box: number;
    perInterval: number;
    interval: TimeSpan;
    deleted?: boolean;
}

export class PrescriptionXDrugsList {
    prescriptionXDrugs: PrescriptionXDrugsLookup[];
}

export class AddPrescriptionXDrugCommand {
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: TimeSpan;
}

export class UpdatePrescriptionXDrugCommand {
    id: number;
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: TimeSpan;
}

export abstract class PrescriptionXDrugData {
    abstract GetPrescriptionXDrugs(): Observable<PrescriptionXDrugsList>;
    abstract AddPrescriptionXDrug(addPrescriptionXDrugCommand: AddPrescriptionXDrugCommand): Observable<Result>;
    abstract DeletePrescriptionXDrug(id: number): Observable<Result>;
    abstract UpdatePrescriptionXDrug(updatePrescriptionXDrugCommand: UpdatePrescriptionXDrugCommand): Observable<Result>;
}
