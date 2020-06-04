import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PrescriptionData, PrescriptionDetails, UpdatePrescriptionCommand, AddPrescriptionCommand } from 'src/app/@core/data/prescription';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { Location } from '@angular/common';
import { MedicalCheckData, MedicalCheckDetails } from 'src/app/@core/data/medicalcheck';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {
  isLoading = false;
  prescriptionForm: FormGroup;
  prescriptionId: number;
  medicalCheckId: number;
  medicalCheck: MedicalCheckDetails;
  isDeleted = false;
  isAdmin = false;
  isDoctor = false;
  isDoctorSubscription: Subscription;
  isAdminSubscription: Subscription;
  constructor(private prescriptionData: PrescriptionData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location, private medicalCheckData: MedicalCheckData,
    private authService: AuthService) { }

  ngOnInit() {
      if (Number(this.route.snapshot.params.prescriptionId)) {
          this.prescriptionId = +this.route.snapshot.params.prescriptionId;
      } else if (Number(this.route.snapshot.params.medicalCheckId)) {
          this.medicalCheckId = +this.route.snapshot.params.medicalCheckId;
      }
      this.isAdminSubscription = this.authService.isAdmin.subscribe((isAdmin: boolean) => {
          this.isAdmin = isAdmin;
      })
      this.isDoctorSubscription = this.authService.isDoctor.subscribe((isDoctor: boolean) => {
        this.isDoctor = isDoctor;
      })
      this.initForm();
  }

  initForm() {
      this.prescriptionForm = new FormGroup({
          noOfDays: new FormControl('', [Validators.required]),
          description: new FormControl('', [Validators.required]),
          medicalCheckTypeName: new FormControl({value: '', disabled: true}),
          diagnosisName: new FormControl({value: '', disabled: true}),
          clinicName: new FormControl({value: '', disabled: true}),
          employeeName: new FormControl({value: '', disabled: true}),
          patientName: new FormControl({value: '', disabled: true})
      })
      if (this.prescriptionId) {
          this.getPrescription();
      } else if (this.medicalCheckId) {
        this.getMedicalCheck();
    }
  }

  getMedicalCheck() {
    this.isLoading = true;
    this.medicalCheckData.GetMedicalCheckDetails(this.medicalCheckId).subscribe((medicalCheck: MedicalCheckDetails) => {
        this.medicalCheck = medicalCheck;
        this.prescriptionForm.patchValue(
            {clinicName: medicalCheck.clinicName,
            medicalCheckTypeName: medicalCheck.medicalCheckTypeName,
            diagnosisName: medicalCheck.diagnosisName,
            employeeName: medicalCheck.employeeName,
            patientName: medicalCheck.patientName});
        this.isLoading = false;
    },
    error => {
        this.uiService.showErrorSnackbar(error, null, 3000);
        this.isLoading = false;
    });
  }

  getPrescription() {
      this.isLoading = true;
      this.prescriptionData.GetPrescriptionDetails(this.prescriptionId).subscribe((prescription: PrescriptionDetails) => {
          this.prescriptionForm.setValue({
            noOfDays: prescription.noOfDays,
            description: prescription.description,
            clinicName: prescription.clinicName,
            medicalCheckTypeName: prescription.medicalCheckTypeName,
            diagnosisName: prescription.diagnosisName,
            employeeName: prescription.employeeName,
            patientName: prescription.patientName})
          this.isDeleted = (prescription.deleted || (!prescription.deleted && !this.isAdmin && !this.isDoctor));

          if (this.isDeleted) {
              this.prescriptionForm.disable();
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
      if (this.prescriptionId) {
          this.updatePrescription();
      } else {
          this.addPrescription();
      }
  }

  updatePrescription() {
      const updatePrescriptionCommand: UpdatePrescriptionCommand = {
          id: this.prescriptionId,
          noOfDays: this.prescriptionForm.value.noOfDays,
          description: this.prescriptionForm.value.description
      } as UpdatePrescriptionCommand;

      this.prescriptionData.UpdatePrescription(updatePrescriptionCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  addPrescription() {
      const addPrescriptionCommand: AddPrescriptionCommand = {
          noOfDays: +this.prescriptionForm.value.noOfDays,
          medicalCheckId: this.medicalCheckId,
          description: this.prescriptionForm.value.description,
          clinicId: this.medicalCheck.clinicId,
          patientId: this.medicalCheck.patientId,
          employeeId: this.medicalCheck.employeeId
      } as AddPrescriptionCommand;

      this.prescriptionData.AddPrescription(addPrescriptionCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  deletePrescription() {
      this.isLoading = true;
      this.prescriptionData.DeletePrescription(this.prescriptionId).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      })
  }

  goBack() {
      this._location.back();
    }
}
