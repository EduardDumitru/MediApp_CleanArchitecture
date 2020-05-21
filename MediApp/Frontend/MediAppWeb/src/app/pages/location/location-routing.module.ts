import { RouterModule, Routes } from '@angular/router';
import { CitiesComponent } from './city/cities.component';
import { CityComponent } from './city/city.component';
import { RoleGuardService as RoleGuard } from '../../auth/role-guard.service';
import { CountriesComponent } from './country/countries/countries.component';
import { CountryComponent } from './country/country/country.component';
import { CountiesComponent } from './county/counties/counties.component';
import { CountyComponent } from './county/county/county.component';

const routes: Routes = [
    {
        path: 'cities',
        component: CitiesComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'cities/:id',
        component: CityComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'cities/add',
        component: CityComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'countries',
        component: CountriesComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'countries/:id',
        component: CountryComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'countries/add',
        component: CountryComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'counties',
        component: CountiesComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'counties/:id',
        component: CountyComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
    {
        path: 'counties/add',
        component: CountyComponent,
        canActivate: [RoleGuard],
        data: {expectedRoles: ['Admin']}
    },
];

export const LOCATIONROUTES = RouterModule.forChild(routes);
