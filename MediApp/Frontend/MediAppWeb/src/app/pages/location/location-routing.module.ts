import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CitiesComponent } from './city/cities.component';
import { NotFoundComponent } from '../../notfound/notfound.component';
import { CityComponent } from './city/city.component';
import { RoleGuardService as RoleGuard } from '../../auth/role-guard.service';

const routes: Routes = [
    {
        path: 'cities',
        component: CitiesComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'cities/{id}',
        component: CityComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'countries',
    },
    {
        path: 'countries/{id}'
    },
    {
        path: 'counties',
    },
    {
        path: 'counties/{id}'
    }
];

export const LOCATIONROUTES = RouterModule.forChild(routes);
