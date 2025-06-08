import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, finalize, of } from 'rxjs';
import { Router } from '@angular/router';

import { MedicalCheckTypeLookup, MedicalCheckTypeData, MedicalCheckTypesList } from 'src/app/@core/data/medicalchecktype';
import { UIService } from 'src/app/shared/ui.service';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-medicalchecktypes',
  templateUrl: './medicalchecktypes.component.html',
  styleUrls: ['./medicalchecktypes.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class MedicalchecktypesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<MedicalCheckTypeLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Dependency injection using inject function
  private readonly medicalCheckTypeData = inject(MedicalCheckTypeData);
  private readonly uiService = inject(UIService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.getMedicalCheckTypes();
  }

  getMedicalCheckTypes(): void {
    this.isLoading = true;
    this.medicalCheckTypeData.GetMedicalCheckTypes()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ medicalCheckTypes: [] } as MedicalCheckTypesList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((medicalCheckTypesList: MedicalCheckTypesList) => {
        this.dataSource.data = medicalCheckTypesList.medicalCheckTypes;
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

  navigateToAddMedicalCheckType(): void {
    this.router.navigate(['/employees/medicalchecktypes/add']);
  }
}