import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TreatmentRoutingModule } from './treatment-routes';

// Medical Check components
import { MedicalCheckComponent } from './medicalcheck/medicalcheck/medicalcheck.component';
import { EmployeeMedicalChecksComponent } from './medicalcheck/employeemedicalchecks/employeemedicalchecks.component';
import { PatientMedicalChecksComponent } from './medicalcheck/patientmedicalchecks/patientmedicalchecks.component';
import { AddMedicalCheckPopupComponent } from './medicalcheck/medicalcheck/addmedicalcheckpopup.component';
import { UpdateMedicalCheckComponent } from './medicalcheck/update-medical-check/update-medical-check.component';
import { MedicalChecksByClinicComponent } from './medicalcheck/medical-checks-by-clinic/medical-checks-by-clinic.component';

// Prescription components
import { PrescriptionComponent } from './prescription/prescription/prescription.component';
import { EmployeePrescriptionsComponent } from './prescription/employeeprescriptions/employeeprescriptions.component';
import { PatientPrescriptionsComponent } from './prescription/patientprescriptions/patientprescriptions.component';
import { PrescriptionsByMedicalCheckComponent } from './prescription/prescriptions-by-medical-check/prescriptions-by-medical-check.component';

// PrescriptionXDrug components
import { PrescriptionXDrugComponent } from './prescriptionxdrug/prescriptionxdrug/prescriptionxdrug.component';
import { PrescriptionXDrugsComponent } from './prescriptionxdrug/prescriptionxdrugs/prescriptionxdrugs.component';

@NgModule({
  imports: [
    SharedModule,
    TreatmentRoutingModule,
    // Medical Check components
    MedicalCheckComponent,
    EmployeeMedicalChecksComponent,
    PatientMedicalChecksComponent,
    AddMedicalCheckPopupComponent,
    UpdateMedicalCheckComponent,
    MedicalChecksByClinicComponent,

    // Prescription components
    PrescriptionComponent,
    EmployeePrescriptionsComponent,
    PatientPrescriptionsComponent,
    PrescriptionsByMedicalCheckComponent,

    // PrescriptionXDrug components
    PrescriptionXDrugComponent,
    PrescriptionXDrugsComponent
  ]
})
export class TreatmentModule { }