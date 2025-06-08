import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PrescriptionData, PrescriptionsByMedicalCheckList, PrescriptionsByMedicalCheckLookup } from 'src/app/@core/data/prescription';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-prescriptions-by-medical-check',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './prescriptions-by-medical-check.component.html',
  styleUrls: ['./prescriptions-by-medical-check.component.scss']
})
export class PrescriptionsByMedicalCheckComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = [
    'id',
    'noOfDays',
    'description',
    'medicalCheckId',
    'medicalCheckTypeName',
    'diagnosisName',
    'clinicName',
    'employeeName',
    'patientName',
    'deleted'
  ];
  medicalCheckId = -1;
  dataSource = new MatTableDataSource<PrescriptionsByMedicalCheckLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private prescriptionData = inject(PrescriptionData);
  private uiService = inject(UIService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (Number(this.route.snapshot.params['id'])) {
      this.medicalCheckId = +this.route.snapshot.params['id'];
      this.getPrescriptions();
    }
  }

  getPrescriptions(): void {
    this.isLoading = true;
    this.prescriptionData.GetPrescriptionsByMedicalCheck(this.medicalCheckId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ prescriptionsByMedicalCheck: [] } as PrescriptionsByMedicalCheckList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((prescriptions: PrescriptionsByMedicalCheckList) => {
        this.dataSource.data = prescriptions.prescriptionsByMedicalCheck;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}