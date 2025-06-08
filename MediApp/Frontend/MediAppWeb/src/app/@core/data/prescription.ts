import { Observable } from 'rxjs';
import { Result } from './common/result';
import { TimeSpan } from './common/timespan';
import { Injectable } from '@angular/core';

export interface PrescriptionDetails {
    noOfDays: number;
    description: string;
    medicalCheckId: number;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    employeeName: string;
    patientName: string;
    deleted?: boolean;
}

export interface EmployeePrescriptionLookup {
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
    employeePrescriptions: EmployeePrescriptionLookup[] = [];
}

export interface PrescriptionsByMedicalCheckLookup {
    id: number;
    noOfDays: number;
    description: string;
    medicalCheckId: number;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    patientName: string;
    employeeName: string;
    deleted?: boolean;
}

export class PrescriptionsByMedicalCheckList {
    prescriptionsByMedicalCheck: PrescriptionsByMedicalCheckLookup[] = [];
}

export interface PatientPrescriptionLookup {
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
    patientPrescriptions: PatientPrescriptionLookup[] = [];
}

export interface AddPrescriptionCommand {
    noOfDays: number;
    description: string;
    medicalCheckId: number;
    clinicId: number;
    patientId: number;
    employeeId: number;
}

export interface AddPrescriptionXDrug {
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: TimeSpan;
}

export interface UpdatePrescriptionCommand {
    id: number;
    noOfDays: number;
    description: string;
}

export interface UpdatePrescriptionXDrug {
    id: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: TimeSpan;
}

@Injectable({
    providedIn: 'root'
})

export abstract class PrescriptionData {
    abstract GetPrescriptionDetails(id: number): Observable<PrescriptionDetails>;
    abstract GetEmployeePrescriptions(employeeId: number): Observable<EmployeePrescriptionsList>;
    abstract GetPatientPrescriptions(patientId: number): Observable<PatientPrescriptionsList>;
    abstract GetPrescriptionsByMedicalCheck(medicalCheckId: number): Observable<PrescriptionsByMedicalCheckList>;
    abstract AddPrescription(addPrescriptionCommand: AddPrescriptionCommand): Observable<Result | null>;
    abstract UpdatePrescription(updatePrescriptionCommand: UpdatePrescriptionCommand): Observable<Result | null>;
    abstract DeletePrescription(id: number): Observable<Result | null>;
}
