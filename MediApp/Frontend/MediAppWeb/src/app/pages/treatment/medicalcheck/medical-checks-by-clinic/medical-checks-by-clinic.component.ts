import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MedicalChecksByClinicLookup, MedicalChecksByClinicList, MedicalCheckData } from 'src/app/@core/data/medicalcheck';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-medical-checks-by-clinic',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './medical-checks-by-clinic.component.html',
  styleUrls: ['./medical-checks-by-clinic.component.scss']
})
export class MedicalChecksByClinicComponent implements OnInit, AfterViewInit {
  isLoading = true;
  clinicId = -1;
  displayedColumns = ['id', 'appointment', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'patientName', 'patientCnp', 'employeeName', 'deleted'];
  dataSource = new MatTableDataSource<MedicalChecksByClinicLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private employeeMedicalCheckData = inject(MedicalCheckData);
  private uiService = inject(UIService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    if (Number(this.route.snapshot.params['id'])) {
      this.clinicId = +this.route.snapshot.params['id'];
      this.getMedicalChecks();
    }
  }

  getMedicalChecks(): void {
    this.isLoading = true;
    this.employeeMedicalCheckData.GetMedicalChecksByClinic(this.clinicId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ medicalChecksByClinic: [] } as MedicalChecksByClinicList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((medicalChecks: MedicalChecksByClinicList) => {
        this.dataSource.data = medicalChecks.medicalChecksByClinic;
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