import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CountiesLookup, CountiesList, CountyData } from 'src/app/@core/data/county';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-counties',
  templateUrl: './counties.component.html',
  styleUrls: ['./counties.component.scss']
})
export class CountiesComponent implements OnInit, AfterViewInit {

  isLoading = true;
  displayedColumns = ['id', 'name', 'countryName', 'deleted'];
  dataSource = new MatTableDataSource<CountiesLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private countyData: CountyData, private uiService: UIService) { }

  ngOnInit(): void {
    this.getCounties();
  }

  getCounties() {
      this.countyData.GetCounties().subscribe((countiesList: CountiesList) => {
          this.isLoading = false;
          console.log(countiesList);
          this.dataSource.data = countiesList.counties;
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
