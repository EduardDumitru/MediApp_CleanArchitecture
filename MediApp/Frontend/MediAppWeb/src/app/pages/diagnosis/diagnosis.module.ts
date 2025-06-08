import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagnosisComponent } from './diagnosis/diagnosis/diagnosis.component';
import { DiagnosesComponent } from './diagnosis/diagnoses/diagnoses.component';
import { DiagnosisxDrugsComponent } from './diagnosisxdrug/diagnosisxdrugs/diagnosisxdrugs.component';
import { DrugComponent } from './drug/drug/drug.component';
import { DrugsComponent } from './drug/drugs/drugs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DiagnosisRoutingModule } from './diagnosis-routes';
import { DiagnosisXDrugComponent } from './diagnosisxdrug/diagnosisxdrug/diagnosisxdrug.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    DiagnosisRoutingModule,
    DiagnosisComponent,
    DiagnosesComponent,
    DiagnosisxDrugsComponent,
    DiagnosisXDrugComponent,
    DrugComponent,
    DrugsComponent
  ]
})
export class DiagnosisModule { }
