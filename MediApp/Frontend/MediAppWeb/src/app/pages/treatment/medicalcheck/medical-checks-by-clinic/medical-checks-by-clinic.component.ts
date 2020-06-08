import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MedicalChecksByClinicLookup, MedicalChecksByClinicList, MedicalCheckData } from 'src/app/@core/data/medicalcheck';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medical-checks-by-clinic',
  templateUrl: './medical-checks-by-clinic.component.html',
  styleUrls: ['./medical-checks-by-clinic.component.scss']
})
export class MedicalChecksByClinicComponent implements OnInit, AfterViewInit {
  isLoading = true;
  clinicId = -1;
  displayedColumns = ['id', 'appointment', 'medicalCheckTypeName', 'diagnosisName', 'clinicName', 'patientName', 'patientCnp', 'employeeName', 'deleted'];
  dataSource = new MatTableDataSource<MedicalChecksByClinicLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private employeeMedicalCheckData: MedicalCheckData, private uiService: UIService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (Number(this.route.snapshot.params.id)) {
      this.clinicId = +this.route.snapshot.params.id;
      this.getMedicalChecks();
    }
  }

  getMedicalChecks() {
      this.employeeMedicalCheckData.GetMedicalChecksByClinic(this.clinicId)
      .subscribe((medicalChecks: MedicalChecksByClinicList) => {
          this.isLoading = false;
          this.dataSource.data = medicalChecks.medicalChecksByClinic;
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
