import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeTypeLookup, EmployeeTypeData, EmployeeTypesList } from 'src/app/@core/data/employeetype';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-employeetypes',
  templateUrl: './employeetypes.component.html',
  styleUrls: ['./employeetypes.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class EmployeetypesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<EmployeeTypeLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Dependency injection using inject function
  private readonly employeeTypeData = inject(EmployeeTypeData);
  private readonly uiService = inject(UIService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.getEmployeeTypes();
  }

  getEmployeeTypes(): void {
    this.isLoading = true;
    this.employeeTypeData.GetEmployeeTypes()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ employeeTypes: [] } as EmployeeTypesList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((employeeTypesList: EmployeeTypesList) => {
        this.dataSource.data = employeeTypesList.employeeTypes;
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

  navigateToAddEmployeeType(): void {
    this.router.navigate(['/employees/employeetypes/add']);
  }
}