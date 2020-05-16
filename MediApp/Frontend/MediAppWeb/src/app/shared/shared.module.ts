import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule
    ],
})
export class SharedModule { }
