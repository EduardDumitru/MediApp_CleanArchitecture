import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DiagnosisData, DiagnosisDetails, UpdateDiagnosisCommand, AddDiagnosisCommand, RestoreDiagnosisCommand } from 'src/app/@core/data/diagnosis';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.scss']
})
export class DiagnosisComponent implements OnInit {
  isLoading = false;
  diagnosisForm: FormGroup;
  diagnosisId: number;
  isDeleted = false;
  constructor(private diagnosisData: DiagnosisData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
      if (Number(this.route.snapshot.params.id)) {
          this.diagnosisId = +this.route.snapshot.params.id;
      }
      this.initForm();
  }

  initForm() {
      this.diagnosisForm = new FormGroup({
          name: new FormControl('', [Validators.required])
      })
      if (this.diagnosisId) {
          this.getDiagnosis();
      }
  }

  getDiagnosis() {
      this.isLoading = true;
      this.diagnosisData.GetDiagnosisDetails(this.diagnosisId).subscribe((diagnosis: DiagnosisDetails) => {
          this.diagnosisForm.setValue({name: diagnosis.name});
          this.isDeleted = diagnosis.deleted;
          if (this.isDeleted) {
              this.diagnosisForm.disable();
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
      if (this.diagnosisId) {
          this.updateDiagnosis();
      } else {
          this.addDiagnosis();
      }
  }

  updateDiagnosis() {
      const updateDiagnosisCommand: UpdateDiagnosisCommand = {
          id: this.diagnosisId,
          name: this.diagnosisForm.value.name
      } as UpdateDiagnosisCommand;

      this.diagnosisData.UpdateDiagnosis(updateDiagnosisCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  addDiagnosis() {
      const addDiagnosisCommand: AddDiagnosisCommand = {
          name: this.diagnosisForm.value.name
      } as AddDiagnosisCommand;

      this.diagnosisData.AddDiagnosis(addDiagnosisCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  deleteDiagnosis() {
      this.isLoading = true;
      this.diagnosisData.DeleteDiagnosis(this.diagnosisId).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      })
  }

  restoreDiagnosis() {
      this.isLoading = true;
      const restoreDiagnosisCommand: RestoreDiagnosisCommand = {
          id: this.diagnosisId
      } as RestoreDiagnosisCommand;

      this.diagnosisData.RestoreDiagnosis(restoreDiagnosisCommand).subscribe((res: Result) => {
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
