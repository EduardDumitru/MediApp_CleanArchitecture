import { RoleGuardService as RoleGuard } from '../../auth/role-guard.service';
import { AuthGuardService as AuthGuard } from '../../auth/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { EmployeePrescriptionsComponent } from './prescription/employeeprescriptions/employeeprescriptions.component';
import { PrescriptionComponent } from './prescription/prescription/prescription.component';
import { PatientPrescriptionsComponent } from './prescription/patientprescriptions/patientprescriptions.component';

const routes: Routes = [
    {
        path: 'employeeprescriptions/:id',
        component: EmployeePrescriptionsComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin', 'Doctor', 'Nurse']}
    },
    {
        path: 'patientprescriptions/:id',
        component: PatientPrescriptionsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'prescriptions/:prescriptionId',
        component: PrescriptionComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'prescriptions/add/:medicalCheckId',
        component: PrescriptionComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin', 'Doctor']}
    },
];

export const TREATMENTROUTES = RouterModule.forChild(routes);
