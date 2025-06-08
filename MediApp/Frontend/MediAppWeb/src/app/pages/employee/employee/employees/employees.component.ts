import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeData, EmployeesList, EmployeeLookup } from 'src/app/@core/data/employee';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class EmployeesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = [
    'id',
    'name',
    'cnp',
    'employeeTypeName',
    'medicalCheckTypeName',
    'clinicName',
    'startHour',
    'endHour',
    'terminationDate',
    'deleted'
  ];
  dataSource = new MatTableDataSource<EmployeeLookup>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Dependency injection using inject function
  private readonly employeeData = inject(EmployeeData);
  private readonly uiService = inject(UIService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.isLoading = true;
    this.employeeData.GetEmployees()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe((employeesList: EmployeesList) => {
        this.dataSource.data = employeesList.employees;
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

  navigateToAddEmployee(): void {
    this.router.navigate(['/employees/employees/add']);
  }

  formatTime(hours: number, minutes: number): string {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}