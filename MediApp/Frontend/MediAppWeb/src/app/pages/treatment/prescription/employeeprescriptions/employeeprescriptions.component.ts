import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PrescriptionData, EmployeePrescriptionLookup, EmployeePrescriptionsList } from 'src/app/@core/data/prescription';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-employeeprescriptions',
  templateUrl: './employeeprescriptions.component.html',
  styleUrls: ['./employeeprescriptions.component.scss']
})
export class EmployeePrescriptionsComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  displayedColumns = ['id', 'noOfDays', 'description', 'medicalCheckId', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'patientName', 'deleted'];
  employeeId = -1;
  currentUserId = -1;
  isAdmin = false;
  currentUserIdSubscription: Subscription;
  adminSubscription: Subscription;
  dataSource = new MatTableDataSource<EmployeePrescriptionLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private employeePrescriptionData: PrescriptionData, private uiService: UIService, private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    if (Number(this.route.snapshot.params.id)) {
      this.employeeId = +this.route.snapshot.params.id;
    }
    this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
    })
    this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    })
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
    if (this.isAdmin || this.employeeId === this.currentUserId) {
      this.getPrescriptions();
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.currentUserIdSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
