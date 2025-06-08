import { NgModule } from '@angular/core';

import { CitiesComponent } from './city/cities/cities.component';
import { CityComponent } from './city/city/city.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationRoutingModule } from './location-routes.module';
import { CountryComponent } from './country/country/country.component';
import { CountriesComponent } from './country/countries/countries.component';
import { CountyComponent } from './county/county/county.component';
import { CountiesComponent } from './county/counties/counties.component';
import { ClinicComponent } from './clinic/clinic/clinic.component';
import { ClinicsComponent } from './clinic/clinics/clinics.component';

@NgModule({
    imports: [
        LocationRoutingModule,
        SharedModule,
        CitiesComponent,
        CityComponent,
        CountryComponent,
        CountriesComponent,
        CountyComponent,
        CountiesComponent,
        ClinicComponent,
        ClinicsComponent
    ],
    exports: [],
    providers: [],
})
export class LocationModule { }
