import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DiagnosisLookup, DiagnosisData, DiagnosesList } from 'src/app/@core/data/diagnosis';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-diagnoses',
  templateUrl: './diagnoses.component.html',
  styleUrls: ['./diagnoses.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class DiagnosesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<DiagnosisLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Dependency injection using inject function
  private readonly diagnosisData = inject(DiagnosisData);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.getDiagnoses();
  }

  getDiagnoses(): void {
    this.isLoading = true;
    this.diagnosisData.GetDiagnoses()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe((diagnosesList: DiagnosesList) => {
        this.dataSource.data = diagnosesList.diagnoses;
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

  navigateToAddDiagnosis(): void {
    this.router.navigate(['/diagnoses/diagnoses/add']);
  }
}