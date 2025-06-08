import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HolidayIntervalLookup, HolidayIntervalData, HolidayIntervalsList } from 'src/app/@core/data/holidayinterval';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-holidayintervals',
  templateUrl: './holidayintervals.component.html',
  styleUrls: ['./holidayintervals.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class HolidayintervalsComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  displayedColumns = ['id', 'clinicName', 'employeeName', 'startDate', 'endDate', 'deleted'];
  dataSource = new MatTableDataSource<HolidayIntervalLookup>();
  clinicSubscription!: Subscription;
  adminSubscription!: Subscription;
  clinicId?: number;
  isAdmin = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Dependency injection using inject function
  private readonly holidayIntervalData = inject(HolidayIntervalData);
  private readonly uiService = inject(UIService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.clinicSubscription = this.authService.clinicId.subscribe(clinicId => {
      this.clinicId = clinicId;
    });
    this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  getHolidayIntervals(): void {
    this.isLoading = true;
    this.holidayIntervalData.GetHolidayIntervals()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ holidayIntervals: [] } as HolidayIntervalsList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((holidayIntervalsList: HolidayIntervalsList) => {
        this.dataSource.data = holidayIntervalsList.holidayIntervals;
      });
  }

  getHolidayIntervalsByClinicId(): void {
    this.isLoading = true;
    this.holidayIntervalData.GetHolidayIntervalsByClinic(this.clinicId!)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ holidayIntervals: [] } as HolidayIntervalsList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((holidayIntervalsList: HolidayIntervalsList) => {
        this.dataSource.data = holidayIntervalsList.holidayIntervals;
      });
  }

  ngAfterViewInit(): void {
    // Load data after view is initialized
    setTimeout(() => {
      if (this.clinicId) {
        this.getHolidayIntervalsByClinicId();
      } else {
        this.getHolidayIntervals();
      }
    });

    // Setup sorting and pagination
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.clinicSubscription?.unsubscribe();
    this.adminSubscription?.unsubscribe();
  }

  doFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToAddHolidayInterval(): void {
    this.router.navigate(['/employees/holidayintervals/add']);
  }
}