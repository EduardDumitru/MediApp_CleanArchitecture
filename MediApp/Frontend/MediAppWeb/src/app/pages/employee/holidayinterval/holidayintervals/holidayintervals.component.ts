import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HolidayIntervalLookup, HolidayIntervalData, HolidayIntervalsList } from 'src/app/@core/data/holidayinterval';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-holidayintervals',
  templateUrl: './holidayintervals.component.html',
  styleUrls: ['./holidayintervals.component.scss']
})
export class HolidayintervalsComponent implements OnInit, AfterViewInit, OnDestroy {

  isLoading = true;
  displayedColumns = ['id', 'clinicName', 'employeeName', 'startDate', 'endDate', 'deleted'];
  dataSource = new MatTableDataSource<HolidayIntervalLookup>();
  clinicSubscription: Subscription;
  adminSubscription: Subscription;
  clinicId: number = undefined;
  isAdmin = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private holidayIntervalData: HolidayIntervalData, private uiService: UIService, private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.clinicSubscription = this.authService.clinicId.subscribe(clinicId => {
      this.clinicId = clinicId;
    });
    this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  getHolidayIntervals() {
      this.holidayIntervalData.GetHolidayIntervals().subscribe((holidayIntervalsList: HolidayIntervalsList) => {
          this.isLoading = false;
          this.dataSource.data = holidayIntervalsList.holidayIntervals;
      }, error => {
        this.isLoading = false;
        this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  getHolidayIntervalsByClinicId() {
    this.holidayIntervalData.GetHolidayIntervalsByClinic(this.clinicId).subscribe((holidayIntervalsList: HolidayIntervalsList) => {
      this.isLoading = false;
      this.dataSource.data = holidayIntervalsList.holidayIntervals;
    }, error => {
      this.isLoading = false;
      this.uiService.showErrorSnackbar(error, null, 3000);
    });
  }

  ngAfterViewInit(): void {
    if (this.clinicId) {
      this.getHolidayIntervalsByClinicId();
    } else {
      this.getHolidayIntervals();
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.clinicSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
