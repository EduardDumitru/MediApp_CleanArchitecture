import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PatientPrescriptionLookup, PrescriptionData, EmployeePrescriptionsList, PatientPrescriptionsList } from 'src/app/@core/data/prescription';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-patientprescriptions',
  templateUrl: './patientprescriptions.component.html',
  styleUrls: ['./patientprescriptions.component.scss']
})
export class PatientPrescriptionsComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = true;
  displayedColumns = ['id', 'noOfDays', 'description', 'medicalCheckId', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'employeeName', 'deleted'];
  patientId = -1;
  currentUserId = -1;
  isAdmin = false;
  currentUserIdSubscription: Subscription;
  adminSubscription: Subscription;
  dataSource = new MatTableDataSource<PatientPrescriptionLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private employeePrescriptionData: PrescriptionData, private uiService: UIService,
    private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    if (Number(this.route.snapshot.params.id)) {
      this.patientId = +this.route.snapshot.params.id;
    }
    this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
    })
    this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = true;
    })
  }

  getPrescriptions() {
    this.employeePrescriptionData.GetPatientPrescriptions(this.patientId)
    .subscribe((patientPrescriptionsList: PatientPrescriptionsList) => {
        this.isLoading = false;
        this.dataSource.data = patientPrescriptionsList.patientPrescriptions;
    }, error => {
      this.isLoading = false;
      this.uiService.showErrorSnackbar(error, null, 3000);
    });
  }

  ngAfterViewInit(): void {
    if (this.isAdmin || this.patientId === this.currentUserId) {
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
