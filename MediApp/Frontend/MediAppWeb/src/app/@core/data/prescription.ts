import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { PrescriptionXDrugsLookup } from './prescriptionxdrug';
import { TimeSpan } from './common/timespan';

export class PrescriptionDetails {
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

export class PrescriptionsByMedicalCheckLookup {
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
    prescriptionsByMedicalCheck: PrescriptionsByMedicalCheckLookup[];
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
}

export class AddPrescriptionXDrug {
    prescriptionId: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: TimeSpan;
}

export class UpdatePrescriptionCommand {
    id: number;
    noOfDays: number;
    description: string;
}

export class UpdatePrescriptionXDrug {
    id: number;
    drugId: number;
    box: number;
    perInterval: number;
    interval: TimeSpan;
}

export abstract class PrescriptionData {
    abstract GetPrescriptionDetails(id: number): Observable<PrescriptionDetails>;
    abstract GetEmployeePrescriptions(employeeId: number): Observable<EmployeePrescriptionsList>;
    abstract GetPatientPrescriptions(patientId: number): Observable<PatientPrescriptionsList>;
    abstract GetPrescriptionsByMedicalCheck(medicalCheckId: number): Observable<PrescriptionsByMedicalCheckList>;
    abstract AddPrescription(addPrescriptionCommand: AddPrescriptionCommand): Observable<Result>;
    abstract UpdatePrescription(updatePrescriptionCommand: UpdatePrescriptionCommand): Observable<Result>;
    abstract DeletePrescription(id: number): Observable<Result>;
}
