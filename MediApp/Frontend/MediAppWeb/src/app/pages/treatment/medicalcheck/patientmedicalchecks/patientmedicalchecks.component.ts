import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { PatientMedicalCheckLookup, MedicalCheckData, PatientMedicalChecksList } from 'src/app/@core/data/medicalcheck';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-patientmedicalchecks',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './patientmedicalchecks.component.html',
  styleUrls: ['./patientmedicalchecks.component.scss']
})
export class PatientMedicalChecksComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  displayedColumns = ['id', 'appointment', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'employeeName', 'deleted'];
  patientId = -1;
  currentUserId = -1;
  isAdmin = false;

  private currentUserIdSubscription?: Subscription;
  private adminSubscription?: Subscription;

  dataSource = new MatTableDataSource<PatientMedicalCheckLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private employeeMedicalCheckData = inject(MedicalCheckData);
  private uiService = inject(UIService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (Number(this.route.snapshot.params['id'])) {
      this.patientId = +this.route.snapshot.params['id'];
    }

    this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
    });

    this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  getMedicalChecks(): void {
    this.isLoading = true;
    this.employeeMedicalCheckData.GetPatientMedicalChecks(this.patientId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ patientMedicalChecks: [] } as PatientMedicalChecksList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((patientMedicalChecksList: PatientMedicalChecksList) => {
        this.dataSource.data = patientMedicalChecksList.patientMedicalChecks;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Delayed to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.isAdmin || this.patientId === this.currentUserId) {
        this.getMedicalChecks();
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserIdSubscription?.unsubscribe();
    this.adminSubscription?.unsubscribe();
  }

  doFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}