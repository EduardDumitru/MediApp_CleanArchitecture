import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';
import { Time } from '@angular/common';

export class EmployeeDetails {
    startHour: Time;
    endHour: Time;
    terminationDate?: Date;
    name: string;
    cnp: string;
    employeeTypeId: number;
    medicalCheckTypeId?: number;
    clinicId: number;
    deleted?: boolean;
}

export class EmployeeLookup {
    id: number;
    startHour: Time;
    endHour: Time;
    terminationDate?: Date;
    name: string;
    cnp: string;
    employeeTypeName: string;
    medicalCheckTypeName: string;
    clinicName: string;
    deleted?: boolean;
}

export class EmployeesList {
    employees: EmployeeLookup[];
}

export class AddEmployeeCommand {
    startHour: Time;
    endHour: Time;
    userProfileId: number;
    employeeTypeId: number;
    medicalCheckTypeId?: number;
    clinicId: number;
}

export class UpdateEmployeeCommand {
    id: number;
    startHour: Time;
    endHour: Time;
    terminationDate?: Date;
    employeeTypeId: number;
    medicalCheckTypeId?: number;
    clinicId: number;
}

export class RestoreEmployeeCommand {
    id: number;
}

export abstract class EmployeeData {
    abstract GetEmployeeDetails(id: number): Observable<EmployeeDetails>;
    abstract GetEmployees(): Observable<EmployeesList>;
    abstract GetEmployeesDropdown(clinicId: number, medicalCheckTypeId: number): Observable<SelectItemsList>;
    abstract AddEmployee(addEmployeeCommand: AddEmployeeCommand): Observable<Result>;
    abstract UpdateEmployee(updateEmployeeCommand: UpdateEmployeeCommand): Observable<Result>;
    abstract DeleteEmployee(id: number): Observable<Result>;
    abstract RestoreEmployee(restoreEmployeeCommand: RestoreEmployeeCommand): Observable<Result>;
}