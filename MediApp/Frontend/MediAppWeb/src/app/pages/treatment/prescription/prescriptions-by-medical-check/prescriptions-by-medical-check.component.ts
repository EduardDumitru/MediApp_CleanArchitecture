import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PrescriptionData, PrescriptionsByMedicalCheckList, PrescriptionsByMedicalCheckLookup } from 'src/app/@core/data/prescription';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-prescriptions-by-medical-check',
  templateUrl: './prescriptions-by-medical-check.component.html',
  styleUrls: ['./prescriptions-by-medical-check.component.scss']
})
export class PrescriptionsByMedicalCheckComponent implements OnInit, AfterViewInit {
  isLoading = true;
  displayedColumns = ['id', 'noOfDays', 'description', 'medicalCheckId', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'employeeName', 'patientName', 'deleted'];
  medicalCheckId = -1;
  dataSource = new MatTableDataSource<PrescriptionsByMedicalCheckLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private prescriptionData: PrescriptionData, private uiService: UIService,
    private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    if (Number(this.route.snapshot.params.id)) {
      this.medicalCheckId = +this.route.snapshot.params.id;
      this.getPrescriptions();
    }
  }

  getPrescriptions() {
    this.prescriptionData.GetPrescriptionsByMedicalCheck(this.medicalCheckId)
    .subscribe((prescriptions: PrescriptionsByMedicalCheckList) => {
        this.isLoading = false;
        this.dataSource.data = prescriptions.prescriptionsByMedicalCheck;
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
