import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';

export class MedicalCheckTypeDetails {
    name: string;
    deleted?: boolean;
}

export class MedicalCheckTypeLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class MedicalCheckTypesList {
    medicalCheckTypes: MedicalCheckTypeLookup[];
}

export class AddMedicalCheckTypeCommand {
    name: string;
}

export class UpdateMedicalCheckTypeCommand {
    id: number;
    name: string;
}

export class RestoreMedicalCheckTypeCommand {
    id: number;
}

export class MedicalCheckTypeFromClinicDropdownQuery {
    clinicId: number;
    appointment: Date;
}

export abstract class MedicalCheckTypeData {
    abstract GetMedicalCheckTypeDetails(id: number): Observable<MedicalCheckTypeDetails>;
    abstract GetMedicalCheckTypes(): Observable<MedicalCheckTypesList>;
    abstract GetMedicalCheckTypesDropdown(): Observable<SelectItemsList>;
    abstract GetMedicalCheckTypesByClinicDropdown(medicalCheckTypeDropdownQuery: MedicalCheckTypeFromClinicDropdownQuery)
    : Observable<SelectItemsList>;
    abstract AddMedicalCheckType(addMedicalCheckTypeCommand: AddMedicalCheckTypeCommand): Observable<Result>;
    abstract UpdateMedicalCheckType(updateMedicalCheckTypeCommand: UpdateMedicalCheckTypeCommand): Observable<Result>;
    abstract DeleteMedicalCheckType(id: number): Observable<Result>;
    abstract RestoreMedicalCheckType(restoreMedicalCheckTypeCommand: RestoreMedicalCheckTypeCommand): Observable<Result>;
}
