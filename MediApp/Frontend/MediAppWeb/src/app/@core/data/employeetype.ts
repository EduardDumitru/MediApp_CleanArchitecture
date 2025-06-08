import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { Injectable } from '@angular/core';

export interface EmployeeTypeDetails {
    name: string;
    deleted?: boolean;
}

export interface EmployeeTypeLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class EmployeeTypesList {
    employeeTypes: EmployeeTypeLookup[] = [];
}

export interface AddEmployeeTypeCommand {
    name: string;
}

export interface UpdateEmployeeTypeCommand {
    id: number;
    name: string;
}

export interface RestoreEmployeeTypeCommand {
    id: number;
}

@Injectable({
    providedIn: 'root'
})

export abstract class EmployeeTypeData {
    abstract GetEmployeeTypeDetails(id: number): Observable<EmployeeTypeDetails>;
    abstract GetEmployeeTypes(): Observable<EmployeeTypesList>;
    abstract GetEmployeeTypesDropdown(): Observable<SelectItemsList>;
    abstract AddEmployeeType(addEmployeeTypeCommand: AddEmployeeTypeCommand): Observable<Result | null>;
    abstract UpdateEmployeeType(updateEmployeeTypeCommand: UpdateEmployeeTypeCommand): Observable<Result | null>;
    abstract DeleteEmployeeType(id: number): Observable<Result | null>;
    abstract RestoreEmployeeType(restoreEmployeeTypeCommand: RestoreEmployeeTypeCommand): Observable<Result | null>;
}
