import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';

// Add this function to provide imports for standalone components
export function getSharedImports() {
    return [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        AsyncPipe,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatMenuModule,
        MatDialogModule,
        MatNativeDateModule,
        DatePipe,
        RouterLink,
    ];
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        RouterModule,
        AsyncPipe,
        DatePipe,
        RouterLink,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        RouterModule,
        AsyncPipe,
        DatePipe,
        RouterLink,
    ],
})
export class SharedModule { }