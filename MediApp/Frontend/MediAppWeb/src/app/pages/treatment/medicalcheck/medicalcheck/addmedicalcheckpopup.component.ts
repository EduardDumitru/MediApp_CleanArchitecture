import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { getSharedImports } from 'src/app/shared/shared.module';

interface DialogData {
  appointment: Date;
  employeeName: string;
  clinicName: string;
  medicalCheckTypeName: string;
}

@Component({
  selector: 'app-add-medical-check-popup',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  template: `
    <h1 mat-dialog-title>Are you sure?</h1>
    <div mat-dialog-content>
      <p>
        Your appointment will be made on date 
        {{ data.appointment | date: 'dd/MM/yyyy, HH:mm' }} at clinic {{ data.clinicName }}.
        Your doctor will be {{ data.employeeName }} with type {{ data.medicalCheckTypeName }}
      </p>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button [mat-dialog-close]="true">Yes</button>
      <button mat-button [mat-dialog-close]="false">No</button>
    </div>
  `,
  styles: [`
    .dialog-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
  `]
})
export class AddMedicalCheckPopupComponent implements OnInit {
  // Modern dependency injection
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void { }
}