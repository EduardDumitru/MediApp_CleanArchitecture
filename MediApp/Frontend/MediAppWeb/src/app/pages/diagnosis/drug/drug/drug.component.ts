import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DrugData, DrugDetails, UpdateDrugCommand, AddDrugCommand, RestoreDrugCommand } from 'src/app/@core/data/drug';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';

@Component({
  selector: 'app-drug',
  templateUrl: './drug.component.html',
  styleUrls: ['./drug.component.scss']
})
export class DrugComponent implements OnInit {
  isLoading = false;
  drugForm: FormGroup;
  drugId: number;
  isDeleted = false;
  constructor(private drugData: DrugData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
      if (Number(this.route.snapshot.params.id)) {
          this.drugId = +this.route.snapshot.params.id;
      }
      this.initForm();
  }

  initForm() {
      this.drugForm = new FormGroup({
          name: new FormControl('', [Validators.required])
      })
      if (this.drugId) {
          this.getDrug();
      }
  }

  getDrug() {
      this.isLoading = true;
      this.drugData.GetDrugDetails(this.drugId).subscribe((drug: DrugDetails) => {
          this.drugForm.setValue({name: drug.name});
          this.isDeleted = drug.deleted;
          if (this.isDeleted) {
              this.drugForm.disable();
          }
          this.isLoading = false;
      },
          error => {
              this.uiService.showErrorSnackbar(error.message, null, 3000);
              this.isLoading = false;
          });
  }

  onSubmit() {
      this.isLoading = true;
      if (this.drugId) {
          this.updateDrug();
      } else {
          this.addDrug();
      }
  }

  updateDrug() {
      const updateDrugCommand: UpdateDrugCommand = {
          id: this.drugId,
          name: this.drugForm.value.name
      } as UpdateDrugCommand;

      this.drugData.UpdateDrug(updateDrugCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  addDrug() {
      const addDrugCommand: AddDrugCommand = {
          name: this.drugForm.value.name
      } as AddDrugCommand;

      this.drugData.AddDrug(addDrugCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  deleteDrug() {
      this.isLoading = true;
      this.drugData.DeleteDrug(this.drugId).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      })
  }

  restoreDrug() {
      this.isLoading = true;
      const restoreDrugCommand: RestoreDrugCommand = {
          id: this.drugId
      } as RestoreDrugCommand;

      this.drugData.RestoreDrug(restoreDrugCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      })
  }

  goBack() {
      this._location.back();
    }
}
