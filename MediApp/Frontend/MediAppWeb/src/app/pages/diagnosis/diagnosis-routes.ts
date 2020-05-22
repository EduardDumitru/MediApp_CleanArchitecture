import { DiagnosesComponent } from './diagnosis/diagnoses/diagnoses.component';
import { RoleGuardService as RoleGuard } from '../../auth/role-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { DiagnosisComponent } from './diagnosis/diagnosis/diagnosis.component';
import { DrugsComponent } from './drug/drugs/drugs.component';
import { DrugComponent } from './drug/drug/drug.component';
import { DiagnosisxDrugsComponent } from './diagnosisxdrug/diagnosisxdrugs/diagnosisxdrugs.component';
import { DiagnosisXDrugComponent } from './diagnosisxdrug/diagnosisxdrug/diagnosisxdrug.component';

const routes: Routes = [
    {
        path: 'diagnoses',
        component: DiagnosesComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'diagnoses/:id',
        component: DiagnosisComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'diagnoses/add',
        component: DiagnosisComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'drugs',
        component: DrugsComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'drugs/:id',
        component: DrugComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'drugs/add',
        component: DrugComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'diagnosisxdrugs',
        component: DiagnosisxDrugsComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'diagnosisxdrugs/add',
        component: DiagnosisXDrugComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    }
];

export const DIAGNOSISROUTES = RouterModule.forChild(routes);
