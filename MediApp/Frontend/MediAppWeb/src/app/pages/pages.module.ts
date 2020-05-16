import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
@NgModule({
  imports: [
    PagesRoutingModule,
    MiscellaneousModule,
    LayoutModule,
    CommonModule,
    MaterialModule
  ],
  declarations: [
  ],
})
export class PagesModule {
}
