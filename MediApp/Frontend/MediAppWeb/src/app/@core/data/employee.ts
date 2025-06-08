import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { TimeSpan } from './common/timespan';
import { Injectable } from '@angular/core';

export interface EmployeeDropdownQuery {
    clinicId: number;
    medicalCheckTypeId: number;
    appointment: Date;
}

export interface EmployeeDetails {
    id: number;
    startHour: TimeSpan;
    endHour: TimeSpan;
    terminationDate?: Date;
    name: string;
    cnp: string;
    userProfileId: number;
    employeeTypeId: number;
    medicalCheckTypeId?: number;
    clinicId: number;
    deleted?: boolean;
}

export interface EmployeeLookup {
    id: number;
    startHour: TimeSpan;
    endHour: TimeSpan;
    terminationDate?: Date;
    name: string;
    cnp: string;
    employeeTypeName: string;
    medicalCheckTypeName: string;
    clinicName: string;
    deleted?: boolean;
}

export class EmployeesList {
    employees: EmployeeLookup[] = [];
}

export interface AddEmployeeCommand {
    startHour: string;
    endHour: string;
    userProfileId: number;
    employeeTypeId: number;
    medicalCheckTypeId?: number;
    clinicId: number;
}

export interface UpdateEmployeeCommand {
    id: number;
    startHour: string;
    endHour: string;
    terminationDate?: Date;
    employeeTypeId: number;
    medicalCheckTypeId?: number;
    clinicId: number;
}

export interface RestoreEmployeeCommand {
    id: number;
}

@Injectable({
    providedIn: 'root'
})

export abstract class EmployeeData {
    abstract GetEmployeeDetails(id: number): Observable<EmployeeDetails>;
    abstract GetEmployeeDetailsByCurrentUser(): Observable<EmployeeDetails>;
    abstract GetEmployees(): Observable<EmployeesList>;
    abstract GetEmployeesDropdown(employeeDropdownQuery: EmployeeDropdownQuery): Observable<SelectItemsList>;
    abstract GetAllEmployeesDropdown(): Observable<SelectItemsList>;
    abstract AddEmployee(addEmployeeCommand: AddEmployeeCommand): Observable<Result | null>;
    abstract UpdateEmployee(updateEmployeeCommand: UpdateEmployeeCommand): Observable<Result | null>;
    abstract DeleteEmployee(id: number): Observable<Result | null>;
    abstract RestoreEmployee(restoreEmployeeCommand: RestoreEmployeeCommand): Observable<Result | null>;
}
