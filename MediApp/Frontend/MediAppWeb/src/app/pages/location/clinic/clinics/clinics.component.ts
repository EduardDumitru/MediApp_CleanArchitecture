import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { ClinicsLookup, ClinicData, ClinicsList } from 'src/app/@core/data/clinic';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-clinics',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.scss']
})
export class ClinicsComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'countryName', 'countyName', 'cityName', 'deleted'];
  dataSource = new MatTableDataSource<ClinicsLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private clinicData = inject(ClinicData);
  private router = inject(Router);

  ngOnInit(): void {
    this.getClinics();
  }

  getClinics(): void {
    this.isLoading = true;
    this.clinicData.GetClinics()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe((clinicsList: ClinicsList) => {
        this.dataSource.data = clinicsList.clinics;
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

  navigateToClinic(id: number): void {
    this.router.navigate(['/location/clinics', id]);
  }

  addNewClinic(): void {
    this.router.navigate(['/location/clinics/add']);
  }
}