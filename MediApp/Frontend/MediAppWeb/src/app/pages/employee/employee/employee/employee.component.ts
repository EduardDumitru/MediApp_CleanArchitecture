import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeData, EmployeeDetails, UpdateEmployeeCommand, AddEmployeeCommand, RestoreEmployeeCommand } from 'src/app/@core/data/employee';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { Location, Time } from '@angular/common';
import { SelectItemsList, SelectItem } from 'src/app/@core/data/common/selectitem';
import { EmployeeTypeData } from 'src/app/@core/data/employeetype';
import { MedicalCheckTypeData } from 'src/app/@core/data/medicalchecktype';
import { ClinicData } from 'src/app/@core/data/clinic';
import { UserProfileData } from 'src/app/@core/data/userclasses/userprofile';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  isLoading = false;
  employeeForm: FormGroup;
  employeeId: number;
  isDeleted = false;
  userProfileSelectList: SelectItemsList = new SelectItemsList();
  clinicSelectList: SelectItemsList = new SelectItemsList();
  employeeTypeSelectList: SelectItemsList = new SelectItemsList();
  medicalCheckTypeSelectList: SelectItemsList = new SelectItemsList();
  constructor(private employeeData: EmployeeData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location,
    private employeeTypeData: EmployeeTypeData, private medicalCheckTypeData: MedicalCheckTypeData,
    private clinicData: ClinicData, private userProfileData: UserProfileData) { }

  ngOnInit() {
      if (Number(this.route.snapshot.params.id)) {
          this.employeeId = +this.route.snapshot.params.id;
      }
      this.initForm();
      this.getEmployeeTypeSelect();
      this.getMedicalCheckTypeSelect();
      this.getClinicSelect();
  }

  initForm() {
      this.employeeForm = new FormGroup({
          name: new FormControl({value: '', disabled: true}),
          cnp: new FormControl({value: '', disabled: true}),
          userProfileId: new FormControl('', [Validators.required]),
          employeeTypeId: new FormControl('', [Validators.required]),
          medicalCheckTypeId: new FormControl(''),
          clinicId: new FormControl('', [Validators.required]),
          startHour: new FormControl('', [Validators.required]),
          startMinutes: new FormControl('', [Validators.required]),
          endHour: new FormControl('', [Validators.required]),
          endMinutes: new FormControl('', [Validators.required]),
          terminationDate: new FormControl(new Date())
      })
      if (this.employeeId) {
          this.getEmployee();
      } else {
        this.getUserProfileSelect();
      }
  }

  getEmployee() {
      this.isLoading = true;
      this.employeeData.GetEmployeeDetails(this.employeeId).subscribe((employee: EmployeeDetails) => {
        console.log(employee);
          this.employeeForm.patchValue({
            name: employee.name,
            cnp: employee.cnp,
            employeeTypeId: employee.employeeTypeId.toString(),
            medicalCheckTypeId: employee.medicalCheckTypeId.toString(),
            clinicId: employee.clinicId.toString(),
            startHour: employee.startHour.hours,
            startMinutes: employee.startHour.minutes,
            endHour: employee.endHour.hours,
            endMinutes: employee.startHour.minutes,
            terminationDate: new Date(employee.terminationDate)
          });
          this.isDeleted = employee.deleted;
          if (this.isDeleted) {
              this.employeeForm.disable();
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
      if (this.employeeId) {
          this.updateEmployee();
      } else {
          this.addEmployee();
      }
  }

  updateEmployee() {
      const updateEmployeeCommand: UpdateEmployeeCommand = {
          id: this.employeeId,
          startHour: this.employeeForm.value.startHour,
          endHour: this.employeeForm.value.endHour,
          employeeTypeId: +this.employeeForm.value.employeeTypeId,
          medicalCheckTypeId: +this.employeeForm.value.medicalCheckTypeId,
          clinicId: +this.employeeForm.value.clinicId,
          terminationDate: new Date(this.employeeForm.value.terminationDate)
      } as UpdateEmployeeCommand;

      updateEmployeeCommand.startHour.hours = +this.employeeForm.value.startHour;
      updateEmployeeCommand.startHour.minutes = +this.employeeForm.value.startMinutes;
      updateEmployeeCommand.endHour.hours = +this.employeeForm.value.endHour;
      updateEmployeeCommand.endHour.minutes = +this.employeeForm.value.endMinutes;

      this.employeeData.UpdateEmployee(updateEmployeeCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  addEmployee() {
      const addEmployeeCommand: AddEmployeeCommand = {
          userProfileId: +this.employeeForm.value.userProfileId,
          employeeTypeId: +this.employeeForm.value.employeeTypeId,
          medicalCheckTypeId: +this.employeeForm.value.medicalCheckTypeId,
          clinicId: +this.employeeForm.value.clinicId
      } as AddEmployeeCommand;

      addEmployeeCommand.startHour.hours = +this.employeeForm.value.startHour;
      addEmployeeCommand.startHour.minutes = +this.employeeForm.value.startMinutes;
      addEmployeeCommand.endHour.hours = +this.employeeForm.value.endHour;
      addEmployeeCommand.endHour.minutes = +this.employeeForm.value.endMinutes;

      this.employeeData.AddEmployee(addEmployeeCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  deleteEmployee() {
      this.isLoading = true;
      this.employeeData.DeleteEmployee(this.employeeId).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      })
  }

  restoreEmployee() {
      this.isLoading = true;
      const restoreEmployeeCommand: RestoreEmployeeCommand = {
          id: this.employeeId
      } as RestoreEmployeeCommand;

      this.employeeData.RestoreEmployee(restoreEmployeeCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      })
  }

  getUserProfileSelect() {
    this.userProfileData.getUserProfilesDropdown().subscribe((userProfiles: SelectItemsList) => {
      this.userProfileSelectList = userProfiles;
    },
    error => {
        this.uiService.showErrorSnackbar(error.message, null, 3000);
    });
  }

  getEmployeeTypeSelect() {
    this.employeeTypeData.GetEmployeeTypesDropdown().subscribe((empTypes: SelectItemsList) => {
      this.employeeTypeSelectList = empTypes;
    },
    error => {
        this.uiService.showErrorSnackbar(error.message, null, 3000);
    });
  }

  getMedicalCheckTypeSelect() {
    this.medicalCheckTypeData.GetMedicalCheckTypesDropdown().subscribe((medCheckTypes: SelectItemsList) => {
      this.medicalCheckTypeSelectList = medCheckTypes;
    },
    error => {
        this.uiService.showErrorSnackbar(error.message, null, 3000);
    });
  }

  getClinicSelect() {
    this.clinicData.GetClinicsDropdown().subscribe((clinics: SelectItemsList) => {
      this.clinicSelectList = clinics;
    },
    error => {
        this.uiService.showErrorSnackbar(error.message, null, 3000);
    });
  }

  goBack() {
      this._location.back();
    }
}
