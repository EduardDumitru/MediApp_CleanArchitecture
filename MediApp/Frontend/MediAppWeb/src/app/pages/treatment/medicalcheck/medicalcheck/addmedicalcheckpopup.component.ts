import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddMedicalCheckCommand } from 'src/app/@core/data/medicalcheck';

@Component({
    selector: 'app-stop-training',
    template: `<h1 mat-dialog-title>Are you sure?<h1>
             <mat-dialog-content>
             <p>Your appointment will be made on date {{passedData.appointment | date: 'dd/MM/yyyy, HH:mm'}} at clinic {{passedData.clinicName}}.
                 Your doctor will be {{passedData.employeeName}} with type {{passedData.medicalCheckTypeName}}</p>
             </mat-dialog-content>
             <mat-dialog-actions fxLayoutAlign="center">
                 <button mat-button [mat-dialog-close]="true">Yes</button>
                 <button mat-button [mat-dialog-close]="false">No</button>
             </mat-dialog-actions>`
})

export class AddMedicalCheckPopupComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) { }

    ngOnInit() { }
}