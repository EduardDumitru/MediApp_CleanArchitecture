import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CountryLookup, CountryData, CountriesList } from 'src/app/@core/data/country';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit, AfterViewInit {

  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<CountryLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private countryData: CountryData, private uiService: UIService, private router: Router) { }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries() {
      this.countryData.GetCountries().subscribe((countriesList: CountriesList) => {
          this.isLoading = false;
          this.dataSource.data = countriesList.countries;
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
