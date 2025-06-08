import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { CountryLookup, CountryData, CountriesList } from 'src/app/@core/data/country';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<CountryLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private countryData = inject(CountryData);
  private uiService = inject(UIService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries(): void {
    this.isLoading = true;
    this.countryData.GetCountries()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ countries: [] } as CountriesList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((countriesList: CountriesList) => {
        this.dataSource.data = countriesList.countries;
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToCountry(id: number): void {
    this.router.navigate(['/location/countries', id]);
  }

  addNewCountry(): void {
    this.router.navigate(['/location/countries/add']);
  }
}