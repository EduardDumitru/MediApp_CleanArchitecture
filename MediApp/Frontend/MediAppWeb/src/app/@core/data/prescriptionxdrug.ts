import { Observable } from 'rxjs';
import { Result } from './common/result';
import { TimeSpan } from './common/timespan';
import { Injectable } from '@angular/core';

export interface PrescriptionXDrugDetails {
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: TimeSpan;
    deleted: boolean;
}

export interface PrescriptionXDrugsLookup {
    id: number;
    drugName: string;
    box: number;
    perInterval: number;
    interval: TimeSpan;
    deleted?: boolean;
}

export class PrescriptionXDrugsList {
    prescriptionXDrugs: PrescriptionXDrugsLookup[] = [];
}

export interface AddPrescriptionXDrugCommand {
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: string;
}

export interface UpdatePrescriptionXDrugCommand {
    id: number;
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: string;
}

@Injectable({
    providedIn: 'root'
})

export abstract class PrescriptionXDrugData {
    abstract GetPrescriptionXDrugs(prescriptionId: number): Observable<PrescriptionXDrugsList>;
    abstract GetPrescriptionXDrug(id: number): Observable<PrescriptionXDrugDetails>;
    abstract AddPrescriptionXDrug(addPrescriptionXDrugCommand: AddPrescriptionXDrugCommand): Observable<Result | null>;
    abstract DeletePrescriptionXDrug(id: number): Observable<Result | null>;
    abstract UpdatePrescriptionXDrug(updatePrescriptionXDrugCommand: UpdatePrescriptionXDrugCommand): Observable<Result | null>;
}
