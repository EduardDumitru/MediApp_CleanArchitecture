import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../../auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from '../../auth/role-guard.service';
import { UserProfileComponent } from './userprofile/userprofile.component';

const routes: Routes = [
    // {
    //     path: 'users',
    //     component: CitiesComponent,
    //     canActivate: [AuthGuard],
    //     data: {expectedRoles: ['Admin']}
    // },
    {
        path: 'profile/:id',
        component: UserProfileComponent,
        canActivate: [AuthGuard]
    }
];

export const USERROUTES = RouterModule.forChild(routes);
