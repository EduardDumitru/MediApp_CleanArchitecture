import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeMedicalCheckLookup, MedicalCheckData, EmployeeMedicalChecksList } from 'src/app/@core/data/medicalcheck';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-employeemedicalchecks',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './employeemedicalchecks.component.html',
  styleUrls: ['./employeemedicalchecks.component.scss']
})
export class EmployeeMedicalChecksComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  displayedColumns = ['id', 'appointment', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'patientName', 'patientCnp', 'deleted'];
  employeeId = -1;
  currentUserId = -1;
  isAdmin = false;
  isDoctor = false;
  isNurse = false;

  private currentUserIdSubscription?: Subscription;
  private adminSubscription?: Subscription;
  private doctorSubscription?: Subscription;
  private nurseSubscription?: Subscription;

  dataSource = new MatTableDataSource<EmployeeMedicalCheckLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private employeeMedicalCheckData = inject(MedicalCheckData);
  private uiService = inject(UIService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (Number(this.route.snapshot.params['id'])) {
      this.employeeId = +this.route.snapshot.params['id'];
    }

    this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
    });

    this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    this.nurseSubscription = this.authService.isNurse.subscribe(isNurse => {
      this.isNurse = isNurse;
    });

    this.doctorSubscription = this.authService.isDoctor.subscribe(isDoctor => {
      this.isDoctor = isDoctor;
    });
  }

  getMedicalChecks(): void {
    this.isLoading = true;
    this.employeeMedicalCheckData.GetEmployeeMedicalChecks(this.employeeId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ employeeMedicalChecks: [] } as EmployeeMedicalChecksList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((employeeMedicalChecksList: EmployeeMedicalChecksList) => {
        this.dataSource.data = employeeMedicalChecksList.employeeMedicalChecks;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Delayed to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.isAdmin || (this.isDoctor && this.employeeId === this.currentUserId) || this.isNurse) {
        this.getMedicalChecks();
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserIdSubscription?.unsubscribe();
    this.adminSubscription?.unsubscribe();
    this.doctorSubscription?.unsubscribe();
    this.nurseSubscription?.unsubscribe();
  }

  doFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}