import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PatientPrescriptionLookup, PrescriptionData, PatientPrescriptionsList } from 'src/app/@core/data/prescription';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-patientprescriptions',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './patientprescriptions.component.html',
  styleUrls: ['./patientprescriptions.component.scss']
})
export class PatientPrescriptionsComponent implements OnInit, AfterViewInit, OnDestroy {
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
    'deleted'
  ];
  patientId = -1;
  currentUserId = -1;
  isAdmin = false;

  private currentUserIdSubscription?: Subscription;
  private adminSubscription?: Subscription;

  dataSource = new MatTableDataSource<PatientPrescriptionLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private prescriptionData = inject(PrescriptionData);
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
      this.isAdmin = isAdmin; // Fixed bug: was setting to true always
    });
  }

  getPrescriptions(): void {
    this.isLoading = true;
    this.prescriptionData.GetPatientPrescriptions(this.patientId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ patientPrescriptions: [] } as PatientPrescriptionsList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((patientPrescriptionsList: PatientPrescriptionsList) => {
        this.dataSource.data = patientPrescriptionsList.patientPrescriptions;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Delayed to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.isAdmin || this.patientId === this.currentUserId) {
        this.getPrescriptions();
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