import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { roleGuard } from '../../auth/role-guard.service';
import { EmployeesComponent } from './employee/employees/employees.component';
import { EmployeeComponent } from './employee/employee/employee.component';
import { EmployeetypesComponent } from './employeetype/employeetypes/employeetypes.component';
import { EmployeetypeComponent } from './employeetype/employeetype/employeetype.component';
import { MedicalchecktypesComponent } from './medicalchecktype/medicalchecktypes/medicalchecktypes.component';
import { MedicalchecktypeComponent } from './medicalchecktype/medicalchecktype/medicalchecktype.component';
import { HolidayintervalsComponent } from './holidayinterval/holidayintervals/holidayintervals.component';
import { HolidayintervalComponent } from './holidayinterval/holidayinterval/holidayinterval.component';

const routes: Routes = [
    // Note: Specific routes first, then parametrized routes
    {
        path: 'employees/add',
        component: EmployeeComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'employees/:id',
        component: EmployeeComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'employees',
        component: EmployeesComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'employeetypes/add',
        component: EmployeetypeComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'employeetypes/:id',
        component: EmployeetypeComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'employeetypes',
        component: EmployeetypesComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'medicalchecktypes/add',
        component: MedicalchecktypeComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'medicalchecktypes/:id',
        component: MedicalchecktypeComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'medicalchecktypes',
        component: MedicalchecktypesComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'holidayintervals/add',
        component: HolidayintervalComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Nurse'])],
        data: { expectedRoles: ['Admin', 'Doctor', 'Nurse'] }
    },
    {
        path: 'holidayintervals/:id',
        component: HolidayintervalComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Nurse'])],
        data: { expectedRoles: ['Admin', 'Doctor', 'Nurse'] }
    },
    {
        path: 'holidayintervals',
        component: HolidayintervalsComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Nurse'])],
        data: { expectedRoles: ['Admin', 'Doctor', 'Nurse'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }
