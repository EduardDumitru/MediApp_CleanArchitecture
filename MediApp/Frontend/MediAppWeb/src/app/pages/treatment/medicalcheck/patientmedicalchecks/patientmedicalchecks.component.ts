import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { PatientMedicalCheckLookup, MedicalCheckData, PatientMedicalChecksList } from 'src/app/@core/data/medicalcheck';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-patientmedicalchecks',
  templateUrl: './patientmedicalchecks.component.html',
  styleUrls: ['./patientmedicalchecks.component.scss']
})
export class PatientMedicalChecksComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  displayedColumns = ['id', 'appointment', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'employeeName', 'deleted'];
  patientId = -1;
  currentUserId = -1;
  isAdmin = false;
  currentUserIdSubscription: Subscription;
  adminSubscription: Subscription;
  dataSource = new MatTableDataSource<PatientMedicalCheckLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private employeeMedicalCheckData: MedicalCheckData, private uiService: UIService,
    private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    if (Number(this.route.snapshot.params.id)) {
      this.patientId = +this.route.snapshot.params.id;
    }
    this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
    })
    this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    })
  }

  getMedicalChecks() {
    this.employeeMedicalCheckData.GetPatientMedicalChecks(this.patientId)
    .subscribe((patientMedicalChecksList: PatientMedicalChecksList) => {
        this.isLoading = false;
        this.dataSource.data = patientMedicalChecksList.patientMedicalChecks;
    }, error => {
      this.isLoading = false;
      this.uiService.showErrorSnackbar(error, null, 3000);
    });
  }

  ngAfterViewInit(): void {
    if (this.isAdmin || this.patientId === this.currentUserId) {
      this.getMedicalChecks();
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
