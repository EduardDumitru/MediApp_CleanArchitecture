import { DiagnosesComponent } from './diagnosis/diagnoses/diagnoses.component';
import { roleGuard } from '../../auth/role-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { DiagnosisComponent } from './diagnosis/diagnosis/diagnosis.component';
import { DrugsComponent } from './drug/drugs/drugs.component';
import { DrugComponent } from './drug/drug/drug.component';
import { DiagnosisxDrugsComponent } from './diagnosisxdrug/diagnosisxdrugs/diagnosisxdrugs.component';
import { DiagnosisXDrugComponent } from './diagnosisxdrug/diagnosisxdrug/diagnosisxdrug.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: 'diagnoses',
        component: DiagnosesComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'diagnoses/:id',
        component: DiagnosisComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'diagnoses/add',
        component: DiagnosisComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'drugs',
        component: DrugsComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'drugs/:id',
        component: DrugComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'drugs/add',
        component: DrugComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'diagnosisxdrugs',
        component: DiagnosisxDrugsComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'diagnosisxdrugs/add',
        component: DiagnosisXDrugComponent,
        canActivate: [roleGuard(['Admin'])],
        data: { expectedRoles: ['Admin'] }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DiagnosisRoutingModule { }
