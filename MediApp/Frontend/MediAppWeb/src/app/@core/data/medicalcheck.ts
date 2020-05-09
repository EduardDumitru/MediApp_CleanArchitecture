import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';

export class MedicalCheckDetails {
    appointment: Date;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    employeeName: string;
    patientName: string;
    patientCnp: string;
    deleted?: boolean;
}

export class EmployeeMedicalCheckLookup {
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
    employeeMedicalChecks: EmployeeMedicalCheckLookup[];
}

export class PatientMedicalCheckLookup {
    id: number;
    appointment: Date;
    medicalCheckTypeName: string;
    diagnosisName: string;
    clinicName: string;
    employeeName: string;
    deleted?: boolean;
}

export class PatientMedicalChecksList {
    patientMedicalChecks: PatientMedicalCheckLookup[];
}

export class AddMedicalCheckCommand {
    appointment: Date;
    clinicId: number;
    patientId: number;
    employeeId: number;
    medicalCheckTypeId: number;
}

export class UpdateMedicalCheckCommand {
    id: number;
    diagnosisId?: number;
}

export abstract class MedicalCheckData {
    abstract GetMedicalCheckDetails(id: number): Observable<MedicalCheckDetails>;
    abstract GetEmployeeMedicalChecks(employeeId: number): Observable<EmployeeMedicalChecksList>;
    abstract GetPatientMedicalChecks(patientId: number): Observable<PatientMedicalChecksList>;
    abstract AddMedicalCheck(addMedicalCheckCommand: AddMedicalCheckCommand): Observable<Result>;
    abstract UpdateMedicalCheck(updateMedicalCheckCommand: UpdateMedicalCheckCommand): Observable<Result>;
    abstract DeleteMedicalCheck(id: number): Observable<Result>;
}
