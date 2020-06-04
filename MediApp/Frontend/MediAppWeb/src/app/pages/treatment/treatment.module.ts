import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalcheckComponent } from './medicalcheck/medicalcheck/medicalcheck.component';
import { MedicalchecksComponent } from './medicalcheck/medicalchecks/medicalchecks.component';
import { PrescriptionComponent } from './prescription/prescription/prescription.component';
import { EmployeePrescriptionsComponent } from './prescription/employeeprescriptions/employeeprescriptions.component';
import { PrescriptionXDrugComponent } from './prescriptionxdrug/prescriptionxdrug/prescriptionxdrug.component';
import { PrescriptionXDrugsComponent } from './prescriptionxdrug/prescriptionxdrugs/prescriptionxdrugs.component';
import { TREATMENTROUTES } from './treatment-routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { PatientPrescriptionsComponent } from './prescription/patientprescriptions/patientprescriptions.component';



@NgModule({
  declarations: [MedicalcheckComponent, MedicalchecksComponent,
    PrescriptionComponent, EmployeePrescriptionsComponent, PrescriptionXDrugComponent, PrescriptionXDrugsComponent,
    PatientPrescriptionsComponent],
  imports: [
    CommonModule,
    SharedModule,
    TREATMENTROUTES
  ]
})
export class TreatmentModule { }
