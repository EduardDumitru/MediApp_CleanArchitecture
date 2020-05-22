import { RouterModule, Routes } from '@angular/router';
import { RoleGuardService as RoleGuard } from '../../auth/role-guard.service';
import { EmployeesComponent } from './employee/employees/employees.component';
import { EmployeeComponent } from './employee/employee/employee.component';
import { EmployeetypesComponent } from './employeetype/employeetypes/employeetypes.component';
import { EmployeetypeComponent } from './employeetype/employeetype/employeetype.component';
import { MedicalchecktypesComponent } from './medicalchecktype/medicalchecktypes/medicalchecktypes.component';
import { MedicalchecktypeComponent } from './medicalchecktype/medicalchecktype/medicalchecktype.component';
import { HolidayintervalsComponent } from './holidayinterval/holidayintervals/holidayintervals.component';
import { HolidayintervalComponent } from './holidayinterval/holidayinterval/holidayinterval.component';

const routes: Routes = [
    {
        path: 'employees',
        component: EmployeesComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'employees/:id',
        component: EmployeeComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'employees/add',
        component: EmployeeComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'employeetypes',
        component: EmployeetypesComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'employeetypes/:id',
        component: EmployeetypeComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'employeetypes/add',
        component: EmployeetypeComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'medicalchecktypes',
        component: MedicalchecktypesComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'medicalchecktypes/:id',
        component: MedicalchecktypeComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'medicalchecktypes/add',
        component: MedicalchecktypeComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'holidayintervals',
        component: HolidayintervalsComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin', 'Doctor', 'Nurse']}
    },
    {
        path: 'holidayintervals/:id',
        component: HolidayintervalComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin', 'Doctor', 'Nurse']}
    },
    {
        path: 'holidayintervals/add',
        component: HolidayintervalComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin', 'Doctor', 'Nurse']}
    }
];

export const EMPLOYEEROUTES = RouterModule.forChild(routes);
