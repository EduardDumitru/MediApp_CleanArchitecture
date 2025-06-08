import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { CountiesLookup, CountiesList, CountyData } from 'src/app/@core/data/county';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-counties',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './counties.component.html',
  styleUrls: ['./counties.component.scss']
})
export class CountiesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'countryName', 'deleted'];
  dataSource = new MatTableDataSource<CountiesLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private countyData = inject(CountyData);
  private uiService = inject(UIService);
  private router = inject(Router);

  ngOnInit(): void {
    this.getCounties();
  }

  getCounties(): void {
    this.isLoading = true;
    this.countyData.GetCounties()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ counties: [] } as CountiesList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((countiesList: CountiesList) => {
        this.dataSource.data = countiesList.counties;
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

  navigateToCounty(id: number): void {
    this.router.navigate(['/location/counties', id]);
  }

  addNewCounty(): void {
    this.router.navigate(['/location/counties/add']);
  }
}