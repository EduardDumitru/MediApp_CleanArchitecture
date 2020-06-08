import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { MedicalCheckData, MedicalCheckDetails, UpdateMedicalCheckCommand } from 'src/app/@core/data/medicalcheck';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Result } from 'src/app/@core/data/common/result';
import { DiagnosisData } from 'src/app/@core/data/diagnosis';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-update-medical-check',
  templateUrl: './update-medical-check.component.html',
  styleUrls: ['./update-medical-check.component.scss']
})
export class UpdateMedicalCheckComponent implements OnInit, OnDestroy {
  isLoading = false;
  isDeleted = false;
  diagnosisSelectList: SelectItemsList = new SelectItemsList();
  medicalCheckForm: FormGroup;
  medicalCheckId: number;
  showAddPrescription = false;
  hasPrescriptions = false;
  isNurse = false;
  nurseSubscription: Subscription;
  constructor(private medicalCheckData: MedicalCheckData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location, private diagnosisData: DiagnosisData,
    private authService: AuthService) { }

  ngOnInit(): void {
    if (Number(this.route.snapshot.params.id)) {
      this.medicalCheckId = +this.route.snapshot.params.id;
    }
    this.nurseSubscription = this.authService.isNurse.subscribe(isNurse => {
      this.isNurse = isNurse;
    })
    this.initForm();
    this.getDiagnoses();
  }

  ngOnDestroy(): void {
    this.nurseSubscription.unsubscribe();
  }

  initForm() {
    this.medicalCheckForm = new FormGroup({
      medicalCheckTypeName: new FormControl({ value: '', disabled: true }),
      clinicName: new FormControl({ value: '', disabled: true }),
      employeeName: new FormControl({ value: '', disabled: true }),
      patientName: new FormControl({ value: '', disabled: true }),
      diagnosisId: new FormControl('', [Validators.required]),
      appointment: new FormControl({value: new Date(), disabled: true})
    })
    this.getMedicalCheck();
  }

  getDiagnoses() {
    this.isLoading = true;
    this.diagnosisData.GetDiagnosesDropdown().subscribe((diagnoses: SelectItemsList) => {
      this.diagnosisSelectList = diagnoses;
    },
      error => {
        this.uiService.showErrorSnackbar(error, null, 3000);
        this.isLoading = false;
      });
}

  getMedicalCheck() {
    this.isLoading = true;
    this.medicalCheckData.GetMedicalCheckDetails(this.medicalCheckId).subscribe((medicalCheck: MedicalCheckDetails) => {
      this.medicalCheckForm.patchValue(
        {
          clinicName: medicalCheck.clinicName,
          medicalCheckTypeName: medicalCheck.medicalCheckTypeName,
          diagnosisId: medicalCheck.diagnosisId?.toString(),
          employeeName: medicalCheck.employeeName,
          patientName: medicalCheck.patientName,
          appointment: new Date(medicalCheck.appointment)
        });
        this.hasPrescriptions = medicalCheck.hasPrescriptions;
        if (medicalCheck.diagnosisId && medicalCheck.deleted === false && !this.isNurse) {
          this.showAddPrescription = true;
        }
        if (medicalCheck.deleted || this.isNurse) {
          this.isDeleted = true;
          this.medicalCheckForm.disable();
        }
      this.isLoading = false;
    },
      error => {
        this.uiService.showErrorSnackbar(error, null, 3000);
        this.isLoading = false;
      });
  }

  onSubmit() {
    this.isLoading = true;
    this.updateMedicalCheck();
  }

  updateMedicalCheck() {
    const updateMedicalCheckCommand: UpdateMedicalCheckCommand = {
        id: this.medicalCheckId,
        diagnosisId: +this.medicalCheckForm.value.diagnosisId,
    } as UpdateMedicalCheckCommand;

    this.medicalCheckData.UpdateMedicalCheck(updateMedicalCheckCommand).subscribe((res: Result) => {
        this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
        this.getMedicalCheck();
        this.isLoading = false;
    }, error => {
        this.isLoading = false;
        this.uiService.showErrorSnackbar(error, null, 3000);
    });
}
deleteMedicalCheck() {
  this.isLoading = true;
  this.medicalCheckData.DeleteMedicalCheck(this.medicalCheckId).subscribe((res: Result) => {
    this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
    this.isLoading = false;
    this.goBack();
  }, error => {
    this.isLoading = false;
    this.uiService.showErrorSnackbar(error, null, 3000);
  })
}

  goBack() {
    this._location.back();
  }

}
