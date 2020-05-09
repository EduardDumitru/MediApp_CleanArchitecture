import { SelectItemsList } from './common/selectitem';
import { Observable } from 'rxjs';
import { Result } from './common/result';
import { Time } from '@angular/common';

export class PrescriptionXDrugsLookup {
    drugName: string;
    box: number;
    perInterval: number;
    interval: Time;
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
    interval: Time;
}

export class UpdatePrescriptionXDrugCommand {
    id: number;
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: Time;
}

export abstract class DiagnosisData {
    abstract GetPrescriptionXDrugs(): Observable<PrescriptionXDrugsList>;
    abstract AddPrescriptionXDrug(addPrescriptionXDrugCommand: AddPrescriptionXDrugCommand): Observable<Result>;
    abstract DeletePrescriptionXDrug(id: number): Observable<Result>;
    abstract UpdatePrescriptionXDrug(updatePrescriptionXDrugCommand: UpdatePrescriptionXDrugCommand): Observable<Result>;
}
