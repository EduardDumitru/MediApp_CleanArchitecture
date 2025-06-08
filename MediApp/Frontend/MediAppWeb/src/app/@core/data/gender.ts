import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { Injectable } from '@angular/core';

export interface GenderDetails {
    name: string;
    deleted?: boolean;
}

export interface GenderLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class GendersList {
    genders: GenderLookup[] = [];
}

export interface AddGenderCommand {
    name: string;
}

export interface UpdateGenderCommand {
    id: number;
    name: string;
}

export interface RestoreGenderCommand {
    id: number;
}

@Injectable({
    providedIn: 'root'
})

export abstract class GenderData {
    abstract GetGenderDetails(id: number): Observable<GenderDetails>;
    abstract GetGenders(): Observable<GendersList>;
    abstract GetGendersDropdown(): Observable<SelectItemsList>;
    abstract AddGender(addGenderCommand: AddGenderCommand): Observable<Result | null>;
    abstract UpdateGender(updateGenderCommand: UpdateGenderCommand): Observable<Result | null>;
    abstract DeleteGender(id: number): Observable<Result | null>;
    abstract RestoreGender(restoreGenderCommand: RestoreGenderCommand): Observable<Result | null>;
}
