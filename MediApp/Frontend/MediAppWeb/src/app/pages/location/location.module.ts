import { NgModule } from '@angular/core';

import { CitiesComponent } from './city/cities.component';
import { CityComponent } from './city/city.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LOCATIONROUTES } from './location-routing.module';

@NgModule({
    imports: [SharedModule, LOCATIONROUTES],
    exports: [],
    declarations: [CitiesComponent, CityComponent],
    providers: [],
})
export class LocationModule { }
