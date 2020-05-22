import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeTypeLookup, EmployeeTypeData, EmployeeTypesList } from 'src/app/@core/data/employeetype';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employeetypes',
  templateUrl: './employeetypes.component.html',
  styleUrls: ['./employeetypes.component.scss']
})
export class EmployeetypesComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'name', 'deleted'];
  dataSource = new MatTableDataSource<EmployeeTypeLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private employeeTypeData: EmployeeTypeData, private uiService: UIService, private router: Router) { }

  ngOnInit(): void {
    this.getEmployeeTypes();
  }

  getEmployeeTypes() {
      this.employeeTypeData.GetEmployeeTypes().subscribe((employeeTypesList: EmployeeTypesList) => {
          this.isLoading = false;
          this.dataSource.data = employeeTypesList.employeeTypes;
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
