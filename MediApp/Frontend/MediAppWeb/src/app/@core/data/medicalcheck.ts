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

export class MedicalCheckLookup {
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

export class MedicalChecksList {
    medicalChecks: MedicalCheckLookup[];
}

export class AddMedicalCheckCommand {
    name: string;
}

export class UpdateMedicalCheckCommand {
    id: number;
    name: string;
}

export class RestoreMedicalCheckCommand {
    id: number;
}

export abstract class MedicalCheckData {
    abstract GetMedicalCheckDetails(id: number): Observable<MedicalCheckDetails>;
    abstract GetMedicalChecks(): Observable<MedicalChecksList>;
    abstract GetMedicalChecksDropdown(): Observable<SelectItemsList>;
    abstract AddMedicalCheck(addMedicalCheckCommand: AddMedicalCheckCommand): Observable<Result>;
    abstract UpdateMedicalCheck(updateMedicalCheckCommand: UpdateMedicalCheckCommand): Observable<Result>;
    abstract DeleteMedicalCheck(id: number): Observable<Result>;
    abstract RestoreMedicalCheck(restoreMedicalCheckCommand: RestoreMedicalCheckCommand): Observable<Result>;
}
