import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CityData, CitiesLookup, CitiesList } from 'src/app/@core/data/city';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cities',
    templateUrl: 'cities.component.html',
    styleUrls: ['./cities.component.scss']
})

export class CitiesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'countryName', 'countyName', 'deleted'];
  dataSource = new MatTableDataSource<CitiesLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private cityService: CityData, private uiService: UIService, private router: Router) { }

  ngOnInit(): void {
    this.getCities();
  }

  getCities() {
      this.cityService.GetCities().subscribe((citiesList: CitiesList) => {
          this.isLoading = false;
          this.dataSource.data = citiesList.cities;
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