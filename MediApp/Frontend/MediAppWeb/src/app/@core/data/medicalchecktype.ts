import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { Injectable } from '@angular/core';

export interface MedicalCheckTypeDetails {
    name: string;
    deleted?: boolean;
}

export interface MedicalCheckTypeLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class MedicalCheckTypesList {
    medicalCheckTypes: MedicalCheckTypeLookup[] = [];
}

export interface AddMedicalCheckTypeCommand {
    name: string;
}

export interface UpdateMedicalCheckTypeCommand {
    id: number;
    name: string;
}

export interface RestoreMedicalCheckTypeCommand {
    id: number;
}

export interface MedicalCheckTypeFromClinicDropdownQuery {
    clinicId: number;
    appointment: Date;
}

@Injectable({
    providedIn: 'root'
})

export abstract class MedicalCheckTypeData {
    abstract GetMedicalCheckTypeDetails(id: number): Observable<MedicalCheckTypeDetails>;
    abstract GetMedicalCheckTypes(): Observable<MedicalCheckTypesList>;
    abstract GetMedicalCheckTypesDropdown(): Observable<SelectItemsList>;
    abstract GetMedicalCheckTypesByClinicDropdown(medicalCheckTypeDropdownQuery: MedicalCheckTypeFromClinicDropdownQuery)
        : Observable<SelectItemsList>;
    abstract AddMedicalCheckType(addMedicalCheckTypeCommand: AddMedicalCheckTypeCommand): Observable<Result | null>;
    abstract UpdateMedicalCheckType(updateMedicalCheckTypeCommand: UpdateMedicalCheckTypeCommand): Observable<Result | null>;
    abstract DeleteMedicalCheckType(id: number): Observable<Result | null>;
    abstract RestoreMedicalCheckType(restoreMedicalCheckTypeCommand: RestoreMedicalCheckTypeCommand): Observable<Result | null>;
}
