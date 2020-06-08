import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalCheckComponent } from './medicalcheck/medicalcheck/medicalcheck.component';
import { EmployeeMedicalChecksComponent } from './medicalcheck/employeemedicalchecks/employeemedicalchecks.component';
import { PrescriptionComponent } from './prescription/prescription/prescription.component';
import { EmployeePrescriptionsComponent } from './prescription/employeeprescriptions/employeeprescriptions.component';
import { PrescriptionXDrugComponent } from './prescriptionxdrug/prescriptionxdrug/prescriptionxdrug.component';
import { PrescriptionXDrugsComponent } from './prescriptionxdrug/prescriptionxdrugs/prescriptionxdrugs.component';
import { TREATMENTROUTES } from './treatment-routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { PatientPrescriptionsComponent } from './prescription/patientprescriptions/patientprescriptions.component';
import { PatientMedicalChecksComponent } from './medicalcheck/patientmedicalchecks/patientmedicalchecks.component';
import { AddMedicalCheckPopupComponent } from './medicalcheck/medicalcheck/addmedicalcheckpopup.component';
import { UpdateMedicalCheckComponent } from './medicalcheck/update-medical-check/update-medical-check.component';
import { PrescriptionsByMedicalCheckComponent } from './prescription/prescriptions-by-medical-check/prescriptions-by-medical-check.component';
import { MedicalChecksByClinicComponent } from './medicalcheck/medical-checks-by-clinic/medical-checks-by-clinic.component';



@NgModule({
  declarations: [MedicalCheckComponent, EmployeeMedicalChecksComponent, PatientMedicalChecksComponent,
    PrescriptionComponent, EmployeePrescriptionsComponent, PrescriptionXDrugsComponent,
    PatientPrescriptionsComponent, UpdateMedicalCheckComponent, AddMedicalCheckPopupComponent,
    PrescriptionXDrugComponent, PrescriptionsByMedicalCheckComponent, MedicalChecksByClinicComponent],
  imports: [
    CommonModule,
    SharedModule,
    TREATMENTROUTES
  ],
  entryComponents: [
    AddMedicalCheckPopupComponent, PrescriptionXDrugComponent
  ]
})
export class TreatmentModule { }
