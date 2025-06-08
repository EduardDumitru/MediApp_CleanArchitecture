import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { Injectable } from '@angular/core';

export interface ClinicDetails {
    name: string;
    address: string;
    streetName: string;
    streetNo: string;
    phoneNumber: string;
    email: string;
    countryId: number;
    countyId: number;
    cityId: number;
    deleted?: boolean;
}

export interface ClinicsLookup {
    id: number;
    name: string;
    countryName: string;
    countyName: string;
    cityName: string;
    deleted?: boolean;
}

export class ClinicsList {
    clinics: ClinicsLookup[] = [];
}

export interface AddClinicCommand {
    name: string;
    address: string;
    streetName: string;
    streetNo: string;
    phoneNumber: string;
    email: string;
    countryId: number;
    countyId: number;
    cityId: number;
}

export interface UpdateClinicCommand {
    id: number;
    name: string;
    address: string;
    streetName: string;
    streetNo: string;
    phoneNumber: string;
    email: string;
    countryId: number;
    countyId: number;
    cityId: number;
}

export interface RestoreClinicCommand {
    id: number;
}

@Injectable({
    providedIn: 'root'
})

export abstract class ClinicData {
    abstract GetClinicDetails(id: number): Observable<ClinicDetails>;
    abstract GetClinics(): Observable<ClinicsList>;
    abstract GetClinicsDropdown(countryId?: number, countyId?: number, cityId?: number): Observable<SelectItemsList>;
    abstract AddClinic(addClinicCommand: AddClinicCommand): Observable<Result | null>;
    abstract UpdateClinic(updateClinicCommand: UpdateClinicCommand): Observable<Result | null>;
    abstract DeleteClinic(id: number): Observable<Result | null>;
    abstract RestoreClinic(restoreClinicCommand: RestoreClinicCommand): Observable<Result | null>;
}
