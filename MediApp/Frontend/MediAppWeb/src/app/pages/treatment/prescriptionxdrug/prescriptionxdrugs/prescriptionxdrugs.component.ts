import { Component, OnInit, ViewChild, AfterViewInit, Input, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  PrescriptionXDrugsLookup, PrescriptionXDrugData,
  PrescriptionXDrugsList, UpdatePrescriptionXDrugCommand, PrescriptionXDrugDetails, AddPrescriptionXDrugCommand
} from 'src/app/@core/data/prescriptionxdrug';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Result } from 'src/app/@core/data/common/result';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { TimeSpan } from 'src/app/@core/data/common/timespan';
import { MatDialog } from '@angular/material/dialog';
import { PrescriptionXDrugComponent } from '../prescriptionxdrug/prescriptionxdrug.component';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-prescriptionxdrugs',
  templateUrl: './prescriptionxdrugs.component.html',
  styleUrls: ['./prescriptionxdrugs.component.scss']
})
export class PrescriptionXDrugsComponent implements OnInit, AfterViewInit {
  @Input()
  prescriptionId: number;
  @Input()
  isPrescriptionDeleted = false;
  isLoading = true;
  prescriptionXDrugForm: FormGroup;
  displayedColumns = ['id', 'drugName', 'box', 'perInterval', 'interval', 'deleted', 'actions'];
  dataSource = new MatTableDataSource<PrescriptionXDrugsLookup>();
  prescriptionXDrugId: number;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog,
    private prescriptionXDrugData: PrescriptionXDrugData, private uiService: UIService) { }

  ngOnInit(): void {
    this.getPrescriptionXDrugs();
  }

  initForm() {
    this.prescriptionXDrugForm = new FormGroup({
      prescriptionId: new FormControl('', [Validators.required]),
      drugId: new FormControl('', [Validators.required]),
      box: new FormControl('', [Validators.required]),
      perInterval: new FormControl('', [Validators.required]),
      intervalMinutes: new FormControl('', [Validators.required]),
      intervalHours: new FormControl('', [Validators.required])
    });
  }

  getPrescriptionXDrugs() {
    this.prescriptionXDrugData.GetPrescriptionXDrugs(this.prescriptionId).subscribe((prescriptionXDrugsList: PrescriptionXDrugsList) => {
      this.isLoading = false;
      this.dataSource.data = prescriptionXDrugsList.prescriptionXDrugs;
    }, error => {
      this.isLoading = false;
      this.uiService.showErrorSnackbar(error, null, 3000);
    });
  }

  openDialogToEdit() {
    if (!this.isPrescriptionDeleted) {
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
  }

  openDialogToAdd() {
    this.initForm();

    this.prescriptionXDrugForm.patchValue({
      prescriptionId: this.prescriptionId
    })
    if (!this.isPrescriptionDeleted) {
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
  }

  getPrescriptionXDrug(id: number, deleted: boolean) {
    if (!deleted && !this.isLoading) {
      this.isLoading = true;
      this.initForm();
      this.prescriptionXDrugData.GetPrescriptionXDrug(id).subscribe((prescriptionXDrugDetails: PrescriptionXDrugDetails) => {
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
        this.isLoading = false;
        this.openDialogToEdit();
      }, error => {
        this.isLoading = false;
        this.uiService.showErrorSnackbar(error, null, 3000);
      })
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deletePrescriptionXDrug(id) {
    this.isLoading = true;
    this.prescriptionXDrugData.DeletePrescriptionXDrug(id).subscribe((res: Result) => {
      this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
      this.isLoading = false;
      this.getPrescriptionXDrugs();
    }, error => {
      this.isLoading = false;
      this.uiService.showErrorSnackbar(error, null, 3000);
    })
  }

  updatePrescriptionXDrug(form) {
    this.isLoading = true;
    const updatePrescriptionXDrugCommand: UpdatePrescriptionXDrugCommand = {
      id: this.prescriptionXDrugId,
      prescriptionId: +this.prescriptionXDrugForm.value.prescriptionId,
      drugId: +this.prescriptionXDrugForm.value.drugId,
      box: +this.prescriptionXDrugForm.value.box,
      perInterval: +this.prescriptionXDrugForm.value.perInterval,
      interval: new TimeSpan(+this.prescriptionXDrugForm.value.intervalHours, +this.prescriptionXDrugForm.value.intervalMinutes).toString()
    } as UpdatePrescriptionXDrugCommand;

    this.prescriptionXDrugId = null;
    this.initForm();

    this.prescriptionXDrugData.UpdatePrescriptionXDrug(updatePrescriptionXDrugCommand).subscribe((res: Result) => {
      this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
      this.isLoading = false;
      this.getPrescriptionXDrugs();
    }, error => {
      this.isLoading = false;
      this.uiService.showErrorSnackbar(error, null, 3000);
    })
  }
  addPrescriptionXDrug(form) {
    this.isLoading = true;
    const addPrescriptionXDrugCommand: AddPrescriptionXDrugCommand = {
      prescriptionId: +this.prescriptionXDrugForm.value.prescriptionId,
      drugId: +this.prescriptionXDrugForm.value.drugId,
      box: +this.prescriptionXDrugForm.value.box,
      perInterval: +this.prescriptionXDrugForm.value.perInterval,
      interval: new TimeSpan(+this.prescriptionXDrugForm.value.intervalHours, +this.prescriptionXDrugForm.value.intervalMinutes).toString()
    } as AddPrescriptionXDrugCommand;
    this.initForm();

    this.prescriptionXDrugData.AddPrescriptionXDrug(addPrescriptionXDrugCommand).subscribe((res: Result) => {
      this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
      this.isLoading = false;
      this.getPrescriptionXDrugs();
    }, error => {
      this.isLoading = false;
      this.uiService.showErrorSnackbar(error, null, 3000);
    })
  }
}
