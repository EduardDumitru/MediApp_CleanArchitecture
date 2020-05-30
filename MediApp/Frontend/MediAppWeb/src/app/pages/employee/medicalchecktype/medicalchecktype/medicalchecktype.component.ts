import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MedicalCheckTypeData, MedicalCheckTypeDetails,
  UpdateMedicalCheckTypeCommand, AddMedicalCheckTypeCommand, RestoreMedicalCheckTypeCommand } from 'src/app/@core/data/medicalchecktype';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';

@Component({
  selector: 'app-medicalchecktype',
  templateUrl: './medicalchecktype.component.html',
  styleUrls: ['./medicalchecktype.component.scss']
})
export class MedicalchecktypeComponent implements OnInit {
  isLoading = false;
  medicalCheckTypeForm: FormGroup;
  medicalCheckTypeId: number;
  isDeleted = false;
  constructor(private medicalCheckTypeData: MedicalCheckTypeData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
      if (Number(this.route.snapshot.params.id)) {
          this.medicalCheckTypeId = +this.route.snapshot.params.id;
      }
      this.initForm();
  }

  initForm() {
      this.medicalCheckTypeForm = new FormGroup({
          name: new FormControl('', [Validators.required])
      })
      if (this.medicalCheckTypeId) {
          this.getMedicalCheckType();
      }
  }

  getMedicalCheckType() {
      this.isLoading = true;
      this.medicalCheckTypeData.GetMedicalCheckTypeDetails(this.medicalCheckTypeId)
      .subscribe((medicalCheckType: MedicalCheckTypeDetails) => {
          this.medicalCheckTypeForm.setValue({name: medicalCheckType.name});
          this.isDeleted = medicalCheckType.deleted;
          if (this.isDeleted) {
              this.medicalCheckTypeForm.disable();
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
      if (this.medicalCheckTypeId) {
          this.updateMedicalCheckType();
      } else {
          this.addMedicalCheckType();
      }
  }

  updateMedicalCheckType() {
      const updateMedicalCheckTypeCommand: UpdateMedicalCheckTypeCommand = {
          id: this.medicalCheckTypeId,
          name: this.medicalCheckTypeForm.value.name
      } as UpdateMedicalCheckTypeCommand;

      this.medicalCheckTypeData.UpdateMedicalCheckType(updateMedicalCheckTypeCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  addMedicalCheckType() {
      const addMedicalCheckTypeCommand: AddMedicalCheckTypeCommand = {
          name: this.medicalCheckTypeForm.value.name
      } as AddMedicalCheckTypeCommand;

      this.medicalCheckTypeData.AddMedicalCheckType(addMedicalCheckTypeCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  deleteMedicalCheckType() {
      this.isLoading = true;
      this.medicalCheckTypeData.DeleteMedicalCheckType(this.medicalCheckTypeId).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      })
  }

  restoreMedicalCheckType() {
      this.isLoading = true;
      const restoreMedicalCheckTypeCommand: RestoreMedicalCheckTypeCommand = {
          id: this.medicalCheckTypeId
      } as RestoreMedicalCheckTypeCommand;

      this.medicalCheckTypeData.RestoreMedicalCheckType(restoreMedicalCheckTypeCommand).subscribe((res: Result) => {
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
