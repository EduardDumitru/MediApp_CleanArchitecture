import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ClinicsLookup, ClinicData, ClinicsList } from 'src/app/@core/data/clinic';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.scss']
})
export class ClinicsComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'countryName', 'countyName', 'cityName', 'deleted'];
  dataSource = new MatTableDataSource<ClinicsLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private clinicData: ClinicData, private uiService: UIService, private router: Router) { }

  ngOnInit(): void {
    this.getClinics();
  }

  getClinics() {
      this.clinicData.GetClinics().subscribe((clinicsList: ClinicsList) => {
          this.isLoading = false;
          this.dataSource.data = clinicsList.clinics;
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
