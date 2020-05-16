import { NgModule } from '@angular/core';
import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundComponent } from './notfound/notfound.component';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    MiscellaneousRoutingModule,
    MatCardModule
  ],
  declarations: [
    MiscellaneousComponent,
    NotFoundComponent,
  ],
})
export class MiscellaneousModule { }
