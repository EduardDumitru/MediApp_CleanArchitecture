import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../../auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from '../../auth/role-guard.service';
import { UserProfileComponent } from './userprofile/userprofile.component';
import { GendersComponent } from './gender/genders/genders.component';
import { GenderComponent } from './gender/gender/gender.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
    {
        path: 'profile/:id',
        component: UserProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'genders',
        component: GendersComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'genders/:id',
        component: GenderComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['Admin'] }
    },
    {
        path: 'profiles',
        component: UsersComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: ['Admin'] }
    },
];

export const USERROUTES = RouterModule.forChild(routes);
