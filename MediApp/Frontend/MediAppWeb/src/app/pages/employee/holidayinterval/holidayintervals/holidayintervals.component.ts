import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HolidayIntervalLookup, HolidayIntervalData, HolidayIntervalsList } from 'src/app/@core/data/holidayinterval';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-holidayintervals',
  templateUrl: './holidayintervals.component.html',
  styleUrls: ['./holidayintervals.component.scss']
})
export class HolidayintervalsComponent implements OnInit, AfterViewInit {

  isLoading = true;
  displayedColumns = ['id', 'employeeName', 'startDate', 'endDate', 'deleted'];
  dataSource = new MatTableDataSource<HolidayIntervalLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private holidayIntervalData: HolidayIntervalData, private uiService: UIService, private router: Router) { }

  ngOnInit(): void {
    this.getHolidayIntervals();
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

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
