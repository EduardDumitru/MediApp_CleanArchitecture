import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PrescriptionData, EmployeePrescriptionLookup, EmployeePrescriptionsList } from 'src/app/@core/data/prescription';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-employeeprescriptions',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './employeeprescriptions.component.html',
  styleUrls: ['./employeeprescriptions.component.scss']
})
export class EmployeePrescriptionsComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  displayedColumns = ['id', 'noOfDays', 'description', 'medicalCheckId', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'patientName', 'deleted'];
  employeeId = -1;
  currentUserId = -1;
  isAdmin = false;

  private currentUserIdSubscription?: Subscription;
  private adminSubscription?: Subscription;

  dataSource = new MatTableDataSource<EmployeePrescriptionLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private employeePrescriptionData = inject(PrescriptionData);
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
  }

  getPrescriptions(): void {
    this.isLoading = true;
    this.employeePrescriptionData.GetEmployeePrescriptions(this.employeeId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ employeePrescriptions: [] } as EmployeePrescriptionsList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((employeePrescriptionsList: EmployeePrescriptionsList) => {
        this.dataSource.data = employeePrescriptionsList.employeePrescriptions;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Delayed to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (this.isAdmin || this.employeeId === this.currentUserId) {
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