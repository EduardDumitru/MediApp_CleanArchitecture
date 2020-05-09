import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';

export class ClinicDetails {
    name: string;
    address: string;
    streetName: string;
    streetNo: string;
    phoneNumber: string;
    email: string;
    countryId: number;
    countyId: number;
    ClinicId: number;
    deleted?: boolean;
}

export class ClinicsLookup {
    id: number;
    name: string;
    countryName: string;
    countyName: string;
    ClinicName: string;
    deleted?: boolean;
}

export class ClinicsList {
    Clinics: ClinicsLookup[];
}

export class AddClinicCommand {
    name: string;
    address: string;
    streetName: string;
    streetNo: string;
    phoneNumber: string;
    email: string;
    countryId: number;
    countyId: number;
    ClinicId: number;
}

export class UpdateClinicCommand {
    id: number;
    name: string;
    address: string;
    streetName: string;
    streetNo: string;
    phoneNumber: string;
    email: string;
    countryId: number;
    countyId: number;
    ClinicId: number;
}

export class RestoreClinicCommand {
    id: number;
}

export abstract class ClinicData {
    abstract GetClinicDetails(id: number): Observable<ClinicDetails>;
    abstract GetClinics(): Observable<ClinicsList>;
    abstract GetClinicsDropdown(countryId?: number, countyId?: number, cityId?: number): Observable<SelectItemsList>;
    abstract AddClinic(addClinicCommand: AddClinicCommand): Observable<Result>;
    abstract UpdateClinic(updateClinicCommand: UpdateClinicCommand): Observable<Result>;
    abstract DeleteClinic(id: number): Observable<Result>;
    abstract RestoreClinic(restoreClinicCommand: RestoreClinicCommand): Observable<Result>;
}
