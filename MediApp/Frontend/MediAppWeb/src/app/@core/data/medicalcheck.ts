import { Observable } from 'rxjs';
import { Result } from './common/result';
import { Injectable } from '@angular/core';

export interface MedicalCheckDetails {
    appointment: Date;
    medicalCheckTypeName: string;
    medicalCheckTypeId: number;
    diagnosisName: string;
    diagnosisId: number;
    clinicName: string;
    clinicId: number;
    employeeName: string;
    employeeId: number;
    patientName: string;
    patientId: number;
    patientCnp: string;
    hasPrescriptions: boolean;
    deleted?: boolean;
}

export interface EmployeeMedicalCheckLookup {
    id: number;
    appointment: Date;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    patientName: string;
    patientCnp: string;
    deleted?: boolean;
}

export class EmployeeMedicalChecksList {
    employeeMedicalChecks: EmployeeMedicalCheckLookup[] = [];
}

export interface PatientMedicalCheckLookup {
    id: number;
    appointment: Date;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    employeeName: string;
    deleted?: boolean;
}

export class PatientMedicalChecksList {
    patientMedicalChecks: PatientMedicalCheckLookup[] = [];
}

export interface MedicalChecksToAddLookup {
    appointment: Date;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    employeeName: string;
    deleted?: boolean;
}

export interface MedicalChecksByClinicLookup {
    id: number;
    appointment: Date;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    employeeName: string;
    patientName: string;
    patientCnp: string;
    deleted?: boolean;
}

export class MedicalChecksByClinicList {
    medicalChecksByClinic: MedicalChecksByClinicLookup[] = [];
}

export class MedicalChecksToAddList {
    medicalChecksToAdd: MedicalChecksToAddLookup[] = [];
}

export interface MedicalChecksToAddQuery {
    appointment: Date;
    clinicId: number;
    medicalCheckTypeId: number;
    employeeId: number;
}

export interface AddMedicalCheckCommand {
    appointment: Date;
    clinicId: number;
    patientId: number;
    employeeId: number;
    medicalCheckTypeId: number;
}

export interface UpdateMedicalCheckCommand {
    id: number;
    diagnosisId: number;
}

@Injectable({
    providedIn: 'root'
})

export abstract class MedicalCheckData {
    abstract GetMedicalCheckDetails(id: number): Observable<MedicalCheckDetails>;
    abstract GetEmployeeMedicalChecks(employeeId: number): Observable<EmployeeMedicalChecksList>;
    abstract GetPatientMedicalChecks(patientId: number): Observable<PatientMedicalChecksList>;
    abstract GetMedicalChecksToAdd(medicalChecksToAdd: MedicalChecksToAddQuery): Observable<MedicalChecksToAddList>;
    abstract GetMedicalChecksByClinic(clinicId: number): Observable<MedicalChecksByClinicList>;
    abstract AddMedicalCheck(addMedicalCheckCommand: AddMedicalCheckCommand): Observable<Result | null>;
    abstract UpdateMedicalCheck(updateMedicalCheckCommand: UpdateMedicalCheckCommand): Observable<Result | null>;
    abstract DeleteMedicalCheck(id: number): Observable<Result | null>;
}
