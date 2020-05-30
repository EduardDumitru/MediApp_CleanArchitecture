import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DiagnosisXDrugsLookup, DiagnosisXDrugData, DiagnosisXDrugsList } from 'src/app/@core/data/diagnosisxdrug';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Result } from 'src/app/@core/data/common/result';
import { RestoreDiagnosisCommand } from 'src/app/@core/data/diagnosis';

@Component({
  selector: 'app-diagnosisxdrugs',
  templateUrl: './diagnosisxdrugs.component.html',
  styleUrls: ['./diagnosisxdrugs.component.scss']
})
export class DiagnosisxDrugsComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'diagnosisName', 'drugName', 'deleted', 'actions'];
  dataSource = new MatTableDataSource<DiagnosisXDrugsLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private diagnosisXDrugData: DiagnosisXDrugData, private uiService: UIService) { }

  ngOnInit(): void {
    this.getDiagnosisXDrugs();
  }

  getDiagnosisXDrugs() {
      this.diagnosisXDrugData.GetDiagnosisXDrugs().subscribe((diagnosisXDrugsList: DiagnosisXDrugsList) => {
          this.isLoading = false;
          this.dataSource.data = diagnosisXDrugsList.diagnosisXDrugs;
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

  deleteDiagnosisXDrug(id) {
    console.log(id);
    this.isLoading = true;
    this.diagnosisXDrugData.DeleteDiagnosisXDrug(id).subscribe((res: Result) => {
        this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
        this.isLoading = false;
        this.getDiagnosisXDrugs();
    }, error => {
        this.isLoading = false;
        this.uiService.showErrorSnackbar(error, null, 3000);
    })
}

restoreDiagnosisXDrug(id) {
    this.isLoading = true;
    const restoreDiagnosisCommand: RestoreDiagnosisCommand = {
        id
    } as RestoreDiagnosisCommand;

    this.diagnosisXDrugData.RestoreDiagnosisXDrug(restoreDiagnosisCommand).subscribe((res: Result) => {
        this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
        this.isLoading = false;
        this.getDiagnosisXDrugs();
    }, error => {
        this.isLoading = false;
        this.uiService.showErrorSnackbar(error, null, 3000);
    })
}
}
