import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { roleGuard } from '../../auth/role-guard.service';
import { authGuard } from '../../auth/auth-guard.service';
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
    // Prescription routes - reordered for Angular 20 best practices
    {
        path: 'prescriptions/add/:medicalCheckId',
        component: PrescriptionComponent,
        canActivate: [roleGuard(['Admin', 'Doctor'])],
        data: { expectedRoles: ['Admin', 'Doctor'] }
    },
    {
        path: 'prescriptions/:prescriptionId',
        component: PrescriptionComponent,
        canActivate: [authGuard]
    },
    {
        path: 'employeeprescriptions/:id',
        component: EmployeePrescriptionsComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Nurse'])],
        data: { expectedRoles: ['Admin', 'Doctor', 'Nurse'] }
    },
    {
        path: 'patientprescriptions/:id',
        component: PatientPrescriptionsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'prescriptionsbymedicalcheck/:id',
        component: PrescriptionsByMedicalCheckComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Nurse'])],
        data: { expectedRoles: ['Admin', 'Doctor', 'Nurse'] }
    },

    // Medical Check routes
    {
        path: 'medicalchecks/add',
        component: MedicalCheckComponent,
        canActivate: [authGuard]
    },
    {
        path: 'employeemedicalchecks/update/:id',
        component: UpdateMedicalCheckComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Nurse'])],
        data: { expectedRoles: ['Admin', 'Doctor', 'Nurse'] }
    },
    {
        path: 'employeemedicalchecks/:id',
        component: EmployeeMedicalChecksComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Nurse'])],
        data: { expectedRoles: ['Admin', 'Doctor', 'Nurse'] }
    },
    {
        path: 'patientmedicalchecks/:id',
        component: PatientMedicalChecksComponent,
        canActivate: [authGuard]
    },
    {
        path: 'medicalchecksbyclinic/:id',
        component: MedicalChecksByClinicComponent,
        canActivate: [roleGuard(['Admin', 'Doctor', 'Nurse'])],
        data: { expectedRoles: ['Admin', 'Doctor', 'Nurse'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TreatmentRoutingModule { }
