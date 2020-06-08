import { RoleGuardService as RoleGuard } from '../../auth/role-guard.service';
import { AuthGuardService as AuthGuard } from '../../auth/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { EmployeePrescriptionsComponent } from './prescription/employeeprescriptions/employeeprescriptions.component';
import { PrescriptionComponent } from './prescription/prescription/prescription.component';
import { PatientPrescriptionsComponent } from './prescription/patientprescriptions/patientprescriptions.component';
import { EmployeeMedicalChecksComponent } from './medicalcheck/employeemedicalchecks/employeemedicalchecks.component';
import { PatientMedicalChecksComponent } from './medicalcheck/patientmedicalchecks/patientmedicalchecks.component';
import { MedicalCheckComponent } from './medicalcheck/medicalcheck/medicalcheck.component';
import { UpdateMedicalCheckComponent } from './medicalcheck/update-medical-check/update-medical-check.component';
import { MedicalChecksByClinicComponent } from './medicalcheck/medical-checks-by-clinic/medical-checks-by-clinic.component';
import { PrescriptionsByMedicalCheckComponent } from './prescription/prescriptions-by-medical-check/prescriptions-by-medical-check.component';

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
        path: 'prescriptionsbymedicalcheck/:id',
        component: PrescriptionsByMedicalCheckComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin', 'Doctor', 'Nurse']}
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
    {
        path: 'employeemedicalchecks/:id',
        component: EmployeeMedicalChecksComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin', 'Doctor', 'Nurse']}
    },
    {
        path: 'patientmedicalchecks/:id',
        component: PatientMedicalChecksComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'medicalchecksbyclinic/:id',
        component: MedicalChecksByClinicComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin', 'Doctor', 'Nurse']}
    },
    {
        path: 'medicalchecks/add',
        component: MedicalCheckComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'employeemedicalchecks/update/:id',
        component: UpdateMedicalCheckComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin', 'Doctor', 'Nurse']}
    }
];

export const TREATMENTROUTES = RouterModule.forChild(routes);
