import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { Time } from '@angular/common';
import { PrescriptionXDrugsLookup } from './prescriptionxdrug';

export class PrescriptionDetails {
    noOfDays: number;
    description: string;
    medicalCheckId: number;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    employeeName: string;
    patientName: string;
    drugs: PrescriptionXDrugsLookup[];
    deleted?: boolean;
}

export class EmployeePrescriptionLookup {
    id: number;
    noOfDays: number;
    description: string;
    medicalCheckId: number;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    patientName: string;
    deleted?: boolean;
}

export class EmployeePrescriptionsList {
    employeePrescriptions: EmployeePrescriptionLookup[];
}

export class PatientPrescriptionLookup {
    id: number;
    noOfDays: number;
    description: string;
    medicalCheckId: number;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    employeeName: string;
    deleted?: boolean;
}

export class PatientPrescriptionsList {
    patientPrescriptions: PatientPrescriptionLookup[];
}

export class AddPrescriptionCommand {
    noOfDays: number;
    description: string;
    medicalCheckId: number;
    clinicId: number;
    patientId: number;
    employeeId: number;
    prescriptionXDrugs: AddPrescriptionXDrug[];
}

export class AddPrescriptionXDrug {
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: Time;
}

export class UpdatePrescriptionCommand {
    id: number;
    noOfDays: number;
    description: string;
    prescriptionXDrugs: UpdatePrescriptionXDrug[];
}

export class UpdatePrescriptionXDrug {
    id: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: Time;
}

export abstract class PrescriptionData {
    abstract GetPrescriptionDetails(id: number): Observable<PrescriptionDetails>;
    abstract GetEmployeePrescriptions(employeeId: number): Observable<EmployeePrescriptionsList>;
    abstract GetPatientPrescriptions(patientId: number): Observable<PatientPrescriptionsList>;
    abstract AddPrescription(addPrescriptionCommand: AddPrescriptionCommand): Observable<Result>;
    abstract UpdatePrescription(updatePrescriptionCommand: UpdatePrescriptionCommand): Observable<Result>;
    abstract DeletePrescription(id: number): Observable<Result>;
}
