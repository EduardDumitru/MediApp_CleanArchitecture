import { SelectItemsList } from './common/selectitem';
import { Observable } from 'rxjs';
import { Result } from './common/result';
import { TimeSpan } from './common/timespan';

export class PrescriptionXDrugDetails {
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: TimeSpan;
    deleted: boolean;
}

export class PrescriptionXDrugsLookup {
    id: number;
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
    interval: string;
}

export class UpdatePrescriptionXDrugCommand {
    id: number;
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: string;
}

export abstract class PrescriptionXDrugData {
    abstract GetPrescriptionXDrugs(prescriptionId: number): Observable<PrescriptionXDrugsList>;
    abstract GetPrescriptionXDrug(id: number): Observable<PrescriptionXDrugDetails>;
    abstract AddPrescriptionXDrug(addPrescriptionXDrugCommand: AddPrescriptionXDrugCommand): Observable<Result>;
    abstract DeletePrescriptionXDrug(id: number): Observable<Result>;
    abstract UpdatePrescriptionXDrug(updatePrescriptionXDrugCommand: UpdatePrescriptionXDrugCommand): Observable<Result>;
}
