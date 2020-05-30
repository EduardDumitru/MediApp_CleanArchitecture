import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DiagnosisXDrugData, AddDiagnosisXDrugCommand } from 'src/app/@core/data/diagnosisxdrug';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { DiagnosisData } from 'src/app/@core/data/diagnosis';
import { DrugData } from 'src/app/@core/data/drug';

@Component({
  selector: 'app-diagnosisxdrug',
  templateUrl: './diagnosisxdrug.component.html',
  styleUrls: ['./diagnosisxdrug.component.scss']
})
export class DiagnosisXDrugComponent implements OnInit {
  isLoading = false;
  diagnosisXDrugForm: FormGroup;
  diagnosisSelectList: SelectItemsList = new SelectItemsList();
  drugSelectList: SelectItemsList = new SelectItemsList();
  constructor(private diagnosisXDrugData: DiagnosisXDrugData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location, private diagnosisData: DiagnosisData,
    private drugData: DrugData) { }

  ngOnInit() {
      this.initForm();
      this.getDiagnosesSelect();
      this.getDrugsSelect();
  }

  initForm() {
      this.diagnosisXDrugForm = new FormGroup({
          drugId: new FormControl('', [Validators.required]),
          diagnosisId: new FormControl('', [Validators.required])
      })
  }

  onSubmit() {
      this.isLoading = true;
      this.addDiagnosisXDrug();
  }

  addDiagnosisXDrug() {
      const addDiagnosisXDrugCommand: AddDiagnosisXDrugCommand = {
        drugId: +this.diagnosisXDrugForm.value.drugId,
        diagnosisId: +this.diagnosisXDrugForm.value.diagnosisId
      } as AddDiagnosisXDrugCommand;

      this.diagnosisXDrugData.AddDiagnosisXDrug(addDiagnosisXDrugCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  getDiagnosesSelect() {
    this.diagnosisData.GetDiagnosesDropdown().subscribe((diagnoses: SelectItemsList) => {
        this.diagnosisSelectList = diagnoses;
    },
        error => {
            this.uiService.showErrorSnackbar(error, null, 3000);
        })
  }

  getDrugsSelect() {
    this.drugData.GetDrugsDropdown().subscribe((drugs: SelectItemsList) => {
        this.drugSelectList = drugs;
    },
        error => {
            this.uiService.showErrorSnackbar(error, null, 3000);
        })
  }

  goBack() {
      this._location.back();
    }

}
