import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PrescriptionData, PrescriptionDetails, UpdatePrescriptionCommand, AddPrescriptionCommand } from 'src/app/@core/data/prescription';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { Location } from '@angular/common';
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {
  isLoading = false;
  prescriptionForm: FormGroup;
  prescriptionId: number;
  isDeleted = false;
  constructor(private prescriptionData: PrescriptionData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
      if (Number(this.route.snapshot.params.id)) {
          this.prescriptionId = +this.route.snapshot.params.id;
      }
      this.initForm();
  }

  initForm() {
      this.prescriptionForm = new FormGroup({
          noOfDays: new FormControl('', [Validators.required]),
          description: new FormControl('', [Validators.required]),
          medicalCheckId: new FormControl('', [Validators.required]),
          medicalCheckTypeName: new FormControl({value: '', disabled: true}),
          diagnosisName: new FormControl({value: '', disabled: true}),
          clinicName: new FormControl({value: '', disabled: true}),
          employeeName: new FormControl({value: '', disabled: true}),
          patientName: new FormControl({value: '', disabled: true})
      })
      if (this.prescriptionId) {
          this.getPrescription();
      }
  }

  getPrescription() {
      this.isLoading = true;
      this.prescriptionData.GetPrescriptionDetails(this.prescriptionId).subscribe((prescription: PrescriptionDetails) => {
          // this.prescriptionForm.setValue({name: prescription.name});
          this.isDeleted = prescription.deleted;
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

  // onSubmit() {
  //     this.isLoading = true;
  //     if (this.prescriptionId) {
  //         this.updatePrescription();
  //     } else {
  //         this.addPrescription();
  //     }
  // }

  // updatePrescription() {
  //     const updatePrescriptionCommand: UpdatePrescriptionCommand = {
  //         id: this.prescriptionId,
  //         name: this.prescriptionForm.value.name
  //     } as UpdatePrescriptionCommand;

  //     this.prescriptionData.UpdatePrescription(updatePrescriptionCommand).subscribe((res: Result) => {
  //         this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
  //         this._location.back();
  //         this.isLoading = false;
  //     }, error => {
  //         this.isLoading = false;
  //         this.uiService.showErrorSnackbar(error, null, 3000);
  //     });
  // }

  // addPrescription() {
  //     const addPrescriptionCommand: AddPrescriptionCommand = {
  //         name: this.prescriptionForm.value.name
  //     } as AddPrescriptionCommand;

  //     this.prescriptionData.AddPrescription(addPrescriptionCommand).subscribe((res: Result) => {
  //         this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
  //         this._location.back();
  //         this.isLoading = false;
  //     }, error => {
  //         this.isLoading = false;
  //         this.uiService.showErrorSnackbar(error, null, 3000);
  //     });
  // }

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

  // restorePrescription() {
  //     this.isLoading = true;
  //     const restorePrescriptionCommand: RestorePrescriptionCommand = {
  //         id: this.prescriptionId
  //     } as RestorePrescriptionCommand;

  //     this.prescriptionData.RestorePrescription(restorePrescriptionCommand).subscribe((res: Result) => {
  //         this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
  //         this._location.back();
  //         this.isLoading = false;
  //     }, error => {
  //         this.isLoading = false;
  //         this.uiService.showErrorSnackbar(error, null, 3000);
  //     })
  // }

  goBack() {
      this._location.back();
    }
}
