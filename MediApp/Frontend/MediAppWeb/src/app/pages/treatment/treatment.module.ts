import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalcheckComponent } from './medicalcheck/medicalcheck/medicalcheck.component';
import { MedicalchecksComponent } from './medicalcheck/medicalchecks/medicalchecks.component';
import { PrescriptionComponent } from './prescription/prescription/prescription.component';
import { PrescriptionsComponent } from './prescription/prescriptions/prescriptions.component';
import { PrescriptionxdrugComponent } from './prescriptionxdrug/prescriptionxdrug/prescriptionxdrug.component';
import { PrescriptionxdrugsComponent } from './prescriptionxdrug/prescriptionxdrugs/prescriptionxdrugs.component';



@NgModule({
  declarations: [MedicalcheckComponent, MedicalchecksComponent, PrescriptionComponent, PrescriptionsComponent, PrescriptionxdrugComponent, PrescriptionxdrugsComponent],
  imports: [
    CommonModule
  ]
})
export class TreatmentModule { }
