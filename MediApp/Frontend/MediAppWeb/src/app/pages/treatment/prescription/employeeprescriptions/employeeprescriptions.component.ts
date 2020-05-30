import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PrescriptionData, EmployeePrescriptionLookup, EmployeePrescriptionsList } from 'src/app/@core/data/prescription';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employeeprescriptions',
  templateUrl: './employeeprescriptions.component.html',
  styleUrls: ['./employeeprescriptions.component.scss']
})
export class EmployeePrescriptionsComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'noOfDays', 'description', 'medicalCheckId', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'patientName', 'deleted'];
  employeeId = -1;
  dataSource = new MatTableDataSource<EmployeePrescriptionLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private employeePrescriptionData: PrescriptionData, private uiService: UIService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (Number(this.route.snapshot.params.id)) {
      this.employeeId = +this.route.snapshot.params.id;
    }
    this.getPrescriptions();
  }

  getPrescriptions() {
      this.employeePrescriptionData.GetEmployeePrescriptions(this.employeeId)
      .subscribe((employeePrescriptionsList: EmployeePrescriptionsList) => {
          this.isLoading = false;
          this.dataSource.data = employeePrescriptionsList.employeePrescriptions;
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
