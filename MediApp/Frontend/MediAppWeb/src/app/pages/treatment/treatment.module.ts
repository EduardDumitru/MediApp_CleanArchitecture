import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalcheckComponent } from './medicalcheck/medicalcheck/medicalcheck.component';
import { MedicalchecksComponent } from './medicalcheck/medicalchecks/medicalchecks.component';
import { PrescriptionComponent } from './prescription/prescription/prescription.component';
import { EmployeePrescriptionsComponent } from './prescription/employeeprescriptions/employeeprescriptions.component';
import { PrescriptionxdrugComponent } from './prescriptionxdrug/prescriptionxdrug/prescriptionxdrug.component';
import { PrescriptionxdrugsComponent } from './prescriptionxdrug/prescriptionxdrugs/prescriptionxdrugs.component';
import { MaterialModule } from 'src/app/material.module';
import { TREATMENTROUTES } from './treatment-routes';



@NgModule({
  declarations: [MedicalcheckComponent, MedicalchecksComponent,
    PrescriptionComponent, EmployeePrescriptionsComponent, PrescriptionxdrugComponent, PrescriptionxdrugsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TREATMENTROUTES
  ]
})
export class TreatmentModule { }
