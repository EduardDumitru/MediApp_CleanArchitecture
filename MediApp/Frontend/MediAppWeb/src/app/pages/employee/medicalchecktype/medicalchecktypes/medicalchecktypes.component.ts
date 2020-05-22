import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MedicalCheckTypeLookup, MedicalCheckTypeData, MedicalCheckTypesList } from 'src/app/@core/data/medicalchecktype';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicalchecktypes',
  templateUrl: './medicalchecktypes.component.html',
  styleUrls: ['./medicalchecktypes.component.scss']
})
export class MedicalchecktypesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<MedicalCheckTypeLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private medicalCheckTypeData: MedicalCheckTypeData, private uiService: UIService, private router: Router) { }

  ngOnInit(): void {
    this.getMedicalCheckTypes();
  }

  getMedicalCheckTypes() {
      this.medicalCheckTypeData.GetMedicalCheckTypes().subscribe((medicalCheckTypesList: MedicalCheckTypesList) => {
          this.isLoading = false;
          this.dataSource.data = medicalCheckTypesList.medicalCheckTypes;
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
