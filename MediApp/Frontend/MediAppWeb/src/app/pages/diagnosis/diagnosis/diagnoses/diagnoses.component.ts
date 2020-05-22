import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DiagnosisLookup, DiagnosisData, DiagnosesList } from 'src/app/@core/data/diagnosis';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diagnoses',
  templateUrl: './diagnoses.component.html',
  styleUrls: ['./diagnoses.component.scss']
})
export class DiagnosesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<DiagnosisLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private diagnosisData: DiagnosisData, private uiService: UIService) { }

  ngOnInit(): void {
    this.getDiagnoses();
  }

  getDiagnoses() {
      this.diagnosisData.GetDiagnoses().subscribe((diagnosesList: DiagnosesList) => {
          this.isLoading = false;
          this.dataSource.data = diagnosesList.diagnoses;
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
