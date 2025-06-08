import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DiagnosisXDrugsLookup, DiagnosisXDrugData, DiagnosisXDrugsList, RestoreDiagnosisXDrugCommand } from 'src/app/@core/data/diagnosisxdrug';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Result } from 'src/app/@core/data/common/result';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-diagnosisxdrugs',
  templateUrl: './diagnosisxdrugs.component.html',
  styleUrls: ['./diagnosisxdrugs.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class DiagnosisxDrugsComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'diagnosisName', 'drugName', 'deleted', 'actions'];
  dataSource = new MatTableDataSource<DiagnosisXDrugsLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Dependency injection using inject function
  private readonly diagnosisXDrugData = inject(DiagnosisXDrugData);
  private readonly uiService = inject(UIService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.getDiagnosisXDrugs();
  }

  getDiagnosisXDrugs(): void {
    this.isLoading = true;
    this.diagnosisXDrugData.GetDiagnosisXDrugs()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe((diagnosisXDrugsList: DiagnosisXDrugsList) => {
        this.dataSource.data = diagnosisXDrugsList.diagnosisXDrugs;
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

  deleteDiagnosisXDrug(id: number): void {
    this.isLoading = true;
    this.diagnosisXDrugData.DeleteDiagnosisXDrug(id)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe((res: Result | null) => {
        if (!res) return;

        this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
        this.getDiagnosisXDrugs();
      });
  }

  restoreDiagnosisXDrug(id: number): void {
    this.isLoading = true;

    const restoreDiagnosisXDrugCommand: RestoreDiagnosisXDrugCommand = {
      id
    };

    this.diagnosisXDrugData.RestoreDiagnosisXDrug(restoreDiagnosisXDrugCommand)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe((res: Result | null) => {
        if (!res) return;

        this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
        this.getDiagnosisXDrugs();
      });
  }

  navigateToAddDiagnosisXDrug(): void {
    this.router.navigate(['/diagnoses/diagnosisxdrugs/add']);
  }
}