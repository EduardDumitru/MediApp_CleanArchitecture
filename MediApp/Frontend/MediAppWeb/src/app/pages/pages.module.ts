import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { PAGESROUTES } from './pages-routing.module';
@NgModule({
  imports: [
    PAGESROUTES,
  //  PagesRoutingModule,
    LayoutModule,
    CommonModule,
    MaterialModule
  ],
  declarations: [
  ],
})
export class PagesModule {
}
