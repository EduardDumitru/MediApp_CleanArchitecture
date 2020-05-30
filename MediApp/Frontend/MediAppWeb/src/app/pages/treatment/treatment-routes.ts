import { RoleGuardService as RoleGuard } from '../../auth/role-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { EmployeePrescriptionsComponent } from './prescription/employeeprescriptions/employeeprescriptions.component';

const routes: Routes = [
    {
        path: 'employeeprescriptions/:id',
        component: EmployeePrescriptionsComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Doctor']}
    },
    // {
    //     path: 'employeeprescriptions/:id',
    //     component: EmployeePrescriptionComponent,
    //     canActivate: [RoleGuard],
    //     data: {expectedRoles: ['Admin']}
    // },
    // {
    //     path: 'employeeprescriptions/add',
    //     component: EmployeePrescriptionComponent,
    //     canActivate: [RoleGuard],
    //     data: {expectedRoles: ['Admin']}
    // },
];

export const TREATMENTROUTES = RouterModule.forChild(routes);
