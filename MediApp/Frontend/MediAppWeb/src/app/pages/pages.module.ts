import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    LayoutModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
  ],
})
export class PagesModule {
}
