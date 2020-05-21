import { RouterModule, Routes } from '@angular/router';
import { RoleGuardService as RoleGuard } from '../auth/role-guard.service';
import { AuthGuardService as AuthGuard } from '../auth/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from '../notfound/notfound.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'location',
    loadChildren: './location/location.module#LocationModule', canLoad: [RoleGuard], data: { expectedRoles: ['Admin'] }
  },
  {
    path: 'user',
    loadChildren: './user/user.module#UserModule', canLoad: [AuthGuard]
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];


export const PAGESROUTES = RouterModule.forChild(routes);

