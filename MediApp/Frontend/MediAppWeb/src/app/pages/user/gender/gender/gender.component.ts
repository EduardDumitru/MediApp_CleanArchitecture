import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenderData, GenderDetails, UpdateGenderCommand, AddGenderCommand, RestoreGenderCommand } from 'src/app/@core/data/gender';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss']
})
export class GenderComponent implements OnInit {
  isLoading = false;
  genderForm: FormGroup;
  genderId: number;
  isDeleted = false;
  constructor(private genderData: GenderData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
      if (Number(this.route.snapshot.params.id)) {
          this.genderId = +this.route.snapshot.params.id;
      }
      this.initForm();
  }

  initForm() {
      this.genderForm = new FormGroup({
          name: new FormControl('', [Validators.required])
      })
      if (this.genderId) {
          this.getGender();
      }
  }

  getGender() {
      this.isLoading = true;
      this.genderData.GetGenderDetails(this.genderId).subscribe((gender: GenderDetails) => {
          this.genderForm.setValue({name: gender.name});
          this.isDeleted = gender.deleted;
          if (this.isDeleted) {
              this.genderForm.disable();
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
      if (this.genderId) {
          this.updateGender();
      } else {
          this.addGender();
      }
  }

  updateGender() {
      const updateGenderCommand: UpdateGenderCommand = {
          id: this.genderId,
          name: this.genderForm.value.name
      } as UpdateGenderCommand;

      this.genderData.UpdateGender(updateGenderCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  addGender() {
      const addGenderCommand: AddGenderCommand = {
          name: this.genderForm.value.name
      } as AddGenderCommand;

      this.genderData.AddGender(addGenderCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  deleteGender() {
      this.isLoading = true;
      this.genderData.DeleteGender(this.genderId).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      })
  }

  restoreGender() {
      this.isLoading = true;
      const restoreGenderCommand: RestoreGenderCommand = {
          id: this.genderId
      } as RestoreGenderCommand;

      this.genderData.RestoreGender(restoreGenderCommand).subscribe((res: Result) => {
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
