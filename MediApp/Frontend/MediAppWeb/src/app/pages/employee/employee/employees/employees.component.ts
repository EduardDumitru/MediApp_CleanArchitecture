import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeData, EmployeesList, EmployeeLookup } from 'src/app/@core/data/employee';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'cnp', 'employeeTypeName', 'medicalCheckTypeName',
  'clinicName', 'startHour', 'endHour', 'terminationDate', 'deleted'];
  dataSource = new MatTableDataSource<EmployeeLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private employeeData: EmployeeData, private uiService: UIService) { }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
      this.employeeData.GetEmployees().subscribe((employeesList: EmployeesList) => {
          this.isLoading = false;
          this.dataSource.data = employeesList.employees;
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
