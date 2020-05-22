import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeTypeData, EmployeeTypeDetails, UpdateEmployeeTypeCommand, AddEmployeeTypeCommand, RestoreEmployeeTypeCommand } from 'src/app/@core/data/employeetype';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';

@Component({
  selector: 'app-employeetype',
  templateUrl: './employeetype.component.html',
  styleUrls: ['./employeetype.component.scss']
})
export class EmployeetypeComponent implements OnInit {
  isLoading = false;
  employeeTypeForm: FormGroup;
  employeeTypeId: number;
  isDeleted = false;
  constructor(private employeeTypeData: EmployeeTypeData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
      if (Number(this.route.snapshot.params.id)) {
          this.employeeTypeId = +this.route.snapshot.params.id;
      }
      this.initForm();
  }

  initForm() {
      this.employeeTypeForm = new FormGroup({
          name: new FormControl('', [Validators.required])
      })
      if (this.employeeTypeId) {
          this.getEmployeeType();
      }
  }

  getEmployeeType() {
      this.isLoading = true;
      this.employeeTypeData.GetEmployeeTypeDetails(this.employeeTypeId).subscribe((employeeType: EmployeeTypeDetails) => {
          this.employeeTypeForm.setValue({name: employeeType.name});
          this.isDeleted = employeeType.deleted;
          if (this.isDeleted) {
              this.employeeTypeForm.disable();
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
      if (this.employeeTypeId) {
          this.updateEmployeeType();
      } else {
          this.addEmployeeType();
      }
  }

  updateEmployeeType() {
      const updateEmployeeTypeCommand: UpdateEmployeeTypeCommand = {
          id: this.employeeTypeId,
          name: this.employeeTypeForm.value.name
      } as UpdateEmployeeTypeCommand;

      this.employeeTypeData.UpdateEmployeeType(updateEmployeeTypeCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  addEmployeeType() {
      const addEmployeeTypeCommand: AddEmployeeTypeCommand = {
          name: this.employeeTypeForm.value.name
      } as AddEmployeeTypeCommand;

      this.employeeTypeData.AddEmployeeType(addEmployeeTypeCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  deleteEmployeeType() {
      this.isLoading = true;
      this.employeeTypeData.DeleteEmployeeType(this.employeeTypeId).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      })
  }

  restoreEmployeeType() {
      this.isLoading = true;
      const restoreEmployeeTypeCommand: RestoreEmployeeTypeCommand = {
          id: this.employeeTypeId
      } as RestoreEmployeeTypeCommand;

      this.employeeTypeData.RestoreEmployeeType(restoreEmployeeTypeCommand).subscribe((res: Result) => {
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
