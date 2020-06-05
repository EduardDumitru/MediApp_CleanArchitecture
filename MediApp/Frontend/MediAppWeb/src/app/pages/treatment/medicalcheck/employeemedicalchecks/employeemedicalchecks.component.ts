import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeMedicalCheckLookup, MedicalCheckData, EmployeeMedicalChecksList } from 'src/app/@core/data/medicalcheck';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-employeemedicalchecks',
  templateUrl: './employeemedicalchecks.component.html',
  styleUrls: ['./employeemedicalchecks.component.scss']
})
export class EmployeeMedicalChecksComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  displayedColumns = ['id', 'appointment', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'patientName', 'patientCnp', 'deleted'];
  employeeId = -1;
  currentUserId = -1;
  currentUserIdSubscription: Subscription;
  adminSubscription: Subscription;
  dataSource = new MatTableDataSource<EmployeeMedicalCheckLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private employeeMedicalCheckData: MedicalCheckData, private uiService: UIService, private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    if (Number(this.route.snapshot.params.id)) {
      this.employeeId = +this.route.snapshot.params.id;
    }
    this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
      this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
        if (isAdmin || this.employeeId === this.currentUserId) {
          this.getMedicalChecks();
        }
      })
    })
  }

  getMedicalChecks() {
      this.employeeMedicalCheckData.GetEmployeeMedicalChecks(this.employeeId)
      .subscribe((employeeMedicalChecksList: EmployeeMedicalChecksList) => {
          this.isLoading = false;
          this.dataSource.data = employeeMedicalChecksList.employeeMedicalChecks;
      }, error => {
        this.isLoading = false;
        this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  ngAfterViewInit(): void {
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
