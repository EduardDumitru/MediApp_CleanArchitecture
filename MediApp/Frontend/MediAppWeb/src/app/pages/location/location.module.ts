import { NgModule } from '@angular/core';

import { CitiesComponent } from './city/cities.component';
import { CityComponent } from './city/city.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LOCATIONROUTES } from './location-routing.module';
import { CountryComponent } from './country/country/country.component';
import { CountriesComponent } from './country/countries/countries.component';
import { CountyComponent } from './county/county/county.component';
import { CountiesComponent } from './county/counties/counties.component';

@NgModule({
    imports: [SharedModule, LOCATIONROUTES],
    exports: [],
    declarations: [CitiesComponent, CityComponent, CountryComponent, CountriesComponent, CountyComponent, CountiesComponent],
    providers: [],
})
export class LocationModule { }
