import { Observable } from 'rxjs';
import { SelectItemsList } from './common/selectitem';
import { Result } from './common/result';

export class EmployeeTypeDetails {
    name: string;
    deleted?: boolean;
}

export class EmployeeTypeLookup {
    id: number;
    name: string;
    deleted?: boolean;
}

export class EmployeeTypesList {
    employeeTypes: EmployeeTypeLookup[];
}

export class AddEmployeeTypeCommand {
    name: string;
}

export class UpdateEmployeeTypeCommand {
    id: number;
    name: string;
}

export class RestoreEmployeeTypeCommand {
    id: number;
}

export abstract class EmployeeTypeData {
    abstract GetEmployeeTypeDetails(id: number): Observable<EmployeeTypeDetails>;
    abstract GetEmployeeTypes(): Observable<EmployeeTypesList>;
    abstract GetEmployeeTypesDropdown(): Observable<SelectItemsList>;
    abstract AddEmployeeType(addEmployeeTypeCommand: AddEmployeeTypeCommand): Observable<Result>;
    abstract UpdateEmployeeType(updateEmployeeTypeCommand: UpdateEmployeeTypeCommand): Observable<Result>;
    abstract DeleteEmployeeType(id: number): Observable<Result>;
    abstract RestoreEmployeeType(restoreEmployeeTypeCommand: RestoreEmployeeTypeCommand): Observable<Result>;
}
