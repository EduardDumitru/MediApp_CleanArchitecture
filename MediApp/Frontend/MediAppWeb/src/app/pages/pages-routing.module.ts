import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../auth/auth-guard.service';
import { roleGuard } from '../auth/role-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from '../notfound/notfound.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard]  // Updated from canLoad to canActivate
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
    canActivate: [roleGuard(['Admin'])],  // Updated to functional role guard
    data: { expectedRoles: ['Admin'] }
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [authGuard]  // Updated from canLoad to canActivate
  },
  {
    path: 'employees',
    loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
    canActivate: [roleGuard(['Admin', 'Doctor', 'Nurse'])],  // Updated to functional role guard
    data: { expectedRoles: ['Admin', 'Doctor', 'Nurse'] }
  },
  {
    path: 'diagnoses',
    loadChildren: () => import('./diagnosis/diagnosis.module').then(m => m.DiagnosisModule),
    canActivate: [roleGuard(['Admin'])],  // Updated to functional role guard
    data: { expectedRoles: ['Admin'] }
  },
  {
    path: 'treatments',
    loadChildren: () => import('./treatment/treatment.module').then(m => m.TreatmentModule),
    canActivate: [authGuard]  // Updated from canLoad to canActivate
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
