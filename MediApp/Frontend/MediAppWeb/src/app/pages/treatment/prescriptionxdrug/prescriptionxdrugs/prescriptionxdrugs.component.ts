import { Component, OnInit, ViewChild, AfterViewInit, Input, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  PrescriptionXDrugsLookup, PrescriptionXDrugData,
  PrescriptionXDrugsList, UpdatePrescriptionXDrugCommand,
  PrescriptionXDrugDetails, AddPrescriptionXDrugCommand
} from 'src/app/@core/data/prescriptionxdrug';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Result } from 'src/app/@core/data/common/result';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeSpan } from 'src/app/@core/data/common/timespan';
import { MatDialog } from '@angular/material/dialog';
import { PrescriptionXDrugComponent } from '../prescriptionxdrug/prescriptionxdrug.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-prescriptionxdrugs',
  standalone: true,
  imports: [
    ...getSharedImports()
  ],
  templateUrl: './prescriptionxdrugs.component.html',
  styleUrls: ['./prescriptionxdrugs.component.scss']
})
export class PrescriptionXDrugsComponent implements OnInit, AfterViewInit {
  @Input() prescriptionId!: number;
  @Input() isPrescriptionDeleted = false;

  isLoading = true;
  prescriptionXDrugForm!: FormGroup;
  displayedColumns = ['id', 'drugName', 'box', 'perInterval', 'interval', 'deleted', 'actions'];
  dataSource = new MatTableDataSource<PrescriptionXDrugsLookup>();
  prescriptionXDrugId?: number;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private dialog = inject(MatDialog);
  private prescriptionXDrugData = inject(PrescriptionXDrugData);
  private uiService = inject(UIService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.getPrescriptionXDrugs();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initForm(): void {
    this.prescriptionXDrugForm = this.fb.group({
      prescriptionId: ['', [Validators.required]],
      drugId: ['', [Validators.required]],
      box: ['', [Validators.required]],
      perInterval: ['', [Validators.required]],
      intervalMinutes: ['', [Validators.required]],
      intervalHours: ['', [Validators.required]]
    });
  }

  getPrescriptionXDrugs(): void {
    this.isLoading = true;
    this.prescriptionXDrugData.GetPrescriptionXDrugs(this.prescriptionId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ prescriptionXDrugs: [] } as PrescriptionXDrugsList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((prescriptionXDrugsList: PrescriptionXDrugsList) => {
        this.dataSource.data = prescriptionXDrugsList.prescriptionXDrugs;
      });
  }

  openDialogToEdit(): void {
    if (this.isPrescriptionDeleted) return;

    const dialogRef = this.dialog.open(PrescriptionXDrugComponent, {
      width: '600px',
      data: this.prescriptionXDrugForm
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePrescriptionXDrug(result);
      }
    });
  }

  openDialogToAdd(): void {
    if (this.isPrescriptionDeleted) return;

    this.initForm();
    this.prescriptionXDrugForm.patchValue({
      prescriptionId: this.prescriptionId
    });

    const dialogRef = this.dialog.open(PrescriptionXDrugComponent, {
      width: '600px',
      data: this.prescriptionXDrugForm
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addPrescriptionXDrug(result);
      }
    });
  }

  getPrescriptionXDrug(id: number, deleted: boolean): void {
    if (deleted || this.isLoading) return;

    this.isLoading = true;
    this.initForm();

    this.prescriptionXDrugData.GetPrescriptionXDrug(id)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((prescriptionXDrugDetails: PrescriptionXDrugDetails | null) => {
        if (!prescriptionXDrugDetails) return;

        this.prescriptionXDrugId = id;
        this.prescriptionXDrugForm.setValue({
          prescriptionId: prescriptionXDrugDetails.prescriptionId.toString(),
          drugId: prescriptionXDrugDetails.drugId.toString(),
          box: prescriptionXDrugDetails.box.toString(),
          perInterval: prescriptionXDrugDetails.perInterval.toString(),
          intervalMinutes: prescriptionXDrugDetails.interval.minutes.toString(),
          intervalHours: prescriptionXDrugDetails.interval.hours.toString()
        });

        if (prescriptionXDrugDetails.deleted) {
          this.prescriptionXDrugForm.disable();
        }

        this.openDialogToEdit();
      });
  }

  doFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deletePrescriptionXDrug(id: number): void {
    this.isLoading = true;
    this.prescriptionXDrugData.DeletePrescriptionXDrug(id)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((res: Result | null) => {
        if (!res) return;

        this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
        this.getPrescriptionXDrugs();
      });
  }

  updatePrescriptionXDrug(form: any): void {
    this.isLoading = true;
    const formValue = this.prescriptionXDrugForm.value;

    const updatePrescriptionXDrugCommand: UpdatePrescriptionXDrugCommand = {
      id: this.prescriptionXDrugId!,
      prescriptionId: +formValue.prescriptionId,
      drugId: +formValue.drugId,
      box: +formValue.box,
      perInterval: +formValue.perInterval,
      interval: new TimeSpan(+formValue.intervalHours, +formValue.intervalMinutes).toString()
    };

    this.prescriptionXDrugId = undefined;
    this.initForm();

    this.prescriptionXDrugData.UpdatePrescriptionXDrug(updatePrescriptionXDrugCommand)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((res: Result | null) => {
        if (!res) return;

        this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
        this.getPrescriptionXDrugs();
      });
  }

  addPrescriptionXDrug(form: any): void {
    this.isLoading = true;
    const formValue = this.prescriptionXDrugForm.value;

    const addPrescriptionXDrugCommand: AddPrescriptionXDrugCommand = {
      prescriptionId: +formValue.prescriptionId,
      drugId: +formValue.drugId,
      box: +formValue.box,
      perInterval: +formValue.perInterval,
      interval: new TimeSpan(+formValue.intervalHours, +formValue.intervalMinutes).toString()
    };

    this.initForm();

    this.prescriptionXDrugData.AddPrescriptionXDrug(addPrescriptionXDrugCommand)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((res: Result | null) => {
        if (!res) return;

        this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
        this.getPrescriptionXDrugs();
      });
  }
}