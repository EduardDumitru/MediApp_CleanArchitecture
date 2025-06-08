import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeData, EmployeeDetails, UpdateEmployeeCommand, AddEmployeeCommand, RestoreEmployeeCommand } from 'src/app/@core/data/employee';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { Location } from '@angular/common';
import { SelectItemsList, SelectItem } from 'src/app/@core/data/common/selectitem';
import { EmployeeTypeData } from 'src/app/@core/data/employeetype';
import { MedicalCheckTypeData } from 'src/app/@core/data/medicalchecktype';
import { ClinicData } from 'src/app/@core/data/clinic';
import { UserProfileData } from 'src/app/@core/data/userclasses/userprofile';
import { TimeSpan } from 'src/app/@core/data/common/timespan';
import { finalize } from 'rxjs';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.scss'],
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
})
export class EmployeeComponent implements OnInit {
    isLoading = false;
    employeeForm!: FormGroup;
    employeeId?: number;
    isDeleted = false;
    doctorEmployeeType = 'Doctor';
    userEmployeeType = '';
    employeeTypeId = -1;
    userProfileSelectList: SelectItemsList = new SelectItemsList();
    clinicSelectList: SelectItemsList = new SelectItemsList();
    employeeTypeSelectList: SelectItemsList = new SelectItemsList();
    medicalCheckTypeSelectList: SelectItemsList = new SelectItemsList();
    minutesSelectList: SelectItemsList;
    hoursSelectList: SelectItemsList;

    // Dependency injection using inject function
    private readonly employeeData = inject(EmployeeData);
    private readonly uiService = inject(UIService);
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);
    private readonly employeeTypeData = inject(EmployeeTypeData);
    private readonly medicalCheckTypeData = inject(MedicalCheckTypeData);
    private readonly clinicData = inject(ClinicData);
    private readonly userProfileData = inject(UserProfileData);
    private readonly fb = inject(FormBuilder);

    constructor() {
        const timeSpan = new TimeSpan(0, 0);
        this.minutesSelectList = timeSpan.minutesSelectList;
        this.hoursSelectList = timeSpan.hoursSelectList;
    }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.params['id']);
        if (id) {
            this.employeeId = id;
        }
        this.initForm();
        this.getClinicSelect();
    }

    initForm(): void {
        this.employeeForm = this.fb.group({
            name: [{ value: '', disabled: true }],
            cnp: [{ value: '', disabled: true }],
            userProfileId: [''],
            employeeTypeId: ['', [Validators.required]],
            medicalCheckTypeId: [''],
            clinicId: ['', [Validators.required]],
            startHour: ['', [Validators.required]],
            startMinutes: ['', [Validators.required]],
            endHour: ['', [Validators.required]],
            endMinutes: ['', [Validators.required]],
            terminationDate: [null]
        });

        if (this.employeeId) {
            this.getEmployee();
        } else {
            this.employeeForm.get('userProfileId')?.setValidators(Validators.required);
            this.getUserProfileSelect();
        }
    }

    getEmployee(): void {
        this.isLoading = true;
        this.employeeData.GetEmployeeDetails(this.employeeId!)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((employee: EmployeeDetails) => {
                if (!employee) return;

                this.employeeForm.patchValue({
                    name: employee.name,
                    cnp: employee.cnp,
                    employeeTypeId: employee.employeeTypeId.toString(),
                    medicalCheckTypeId: employee.medicalCheckTypeId?.toString(),
                    clinicId: employee.clinicId.toString(),
                    startHour: employee.startHour.hours.toString(),
                    startMinutes: employee.startHour.minutes.toString(),
                    endHour: employee.endHour.hours.toString(),
                    endMinutes: employee.endHour.minutes.toString(),
                    terminationDate: employee.terminationDate ? new Date(employee.terminationDate) : null
                });

                this.employeeTypeId = employee.employeeTypeId;
                this.isDeleted = !!employee.deleted;

                if (this.isDeleted) {
                    this.employeeForm.disable();
                }

                if (employee.medicalCheckTypeId) {
                    this.getMedicalCheckTypeSelect();
                }

                this.getEmployeeTypeSelect();
            });
    }

    onSubmit(): void {
        if (this.employeeForm.invalid) {
            return;
        }

        this.isLoading = true;

        if (this.employeeId) {
            this.updateEmployee();
        } else {
            this.addEmployee();
        }
    }

    updateEmployee(): void {
        const formValues = this.employeeForm.getRawValue();

        const updateEmployeeCommand: UpdateEmployeeCommand = {
            id: this.employeeId!,
            employeeTypeId: +formValues.employeeTypeId,
            medicalCheckTypeId: +formValues.medicalCheckTypeId,
            clinicId: +formValues.clinicId,
            terminationDate: formValues.terminationDate ? new Date(formValues.terminationDate) : undefined,
            startHour: new TimeSpan(+formValues.startHour, +formValues.startMinutes).toString(),
            endHour: new TimeSpan(+formValues.endHour, +formValues.endMinutes).toString()
        };

        this.employeeData.UpdateEmployee(updateEmployeeCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    addEmployee(): void {
        const formValues = this.employeeForm.getRawValue();

        const addEmployeeCommand: AddEmployeeCommand = {
            userProfileId: +formValues.userProfileId,
            employeeTypeId: +formValues.employeeTypeId,
            medicalCheckTypeId: +formValues.medicalCheckTypeId,
            clinicId: +formValues.clinicId,
            startHour: new TimeSpan(+formValues.startHour, +formValues.startMinutes).toString(),
            endHour: new TimeSpan(+formValues.endHour, +formValues.endMinutes).toString()
        };

        this.employeeData.AddEmployee(addEmployeeCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    deleteEmployee(): void {
        this.isLoading = true;

        this.employeeData.DeleteEmployee(this.employeeId!)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    restoreEmployee(): void {
        this.isLoading = true;

        const restoreEmployeeCommand: RestoreEmployeeCommand = {
            id: this.employeeId!
        };

        this.employeeData.RestoreEmployee(restoreEmployeeCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    getUserProfileSelect(): void {
        this.userProfileData.getUserProfilesDropdown()
            .subscribe((userProfiles: SelectItemsList) => {
                this.userProfileSelectList = userProfiles;
            });
    }

    getEmployeeTypeSelect(): void {
        this.employeeTypeData.GetEmployeeTypesDropdown()
            .subscribe((empTypes: SelectItemsList) => {
                this.employeeTypeSelectList = empTypes;

                if (this.employeeTypeId >= 0) {
                    const foundType = this.employeeTypeSelectList.selectItems
                        .find(x => x.value === this.employeeTypeId.toString());

                    if (foundType) {
                        this.userEmployeeType = foundType.label;
                    }
                }
            });
    }

    getMedicalCheckTypeSelect(): void {
        this.medicalCheckTypeData.GetMedicalCheckTypesDropdown()
            .subscribe((medCheckTypes: SelectItemsList) => {
                this.medicalCheckTypeSelectList = medCheckTypes;
            });
    }

    getClinicSelect(): void {
        this.clinicData.GetClinicsDropdown(undefined, undefined, undefined)
            .subscribe((clinics: SelectItemsList) => {
                this.clinicSelectList = clinics;
            });
    }

    goBack(): void {
        this.location.back();
    }

    employeeTypeChange(employeeTypeId: string): void {
        this.medicalCheckTypeSelectList = new SelectItemsList();
        this.employeeForm.patchValue({ medicalCheckTypeId: '' });

        if (employeeTypeId === '2') {
            this.employeeForm.get('medicalCheckTypeId')?.setValidators(Validators.required);
            this.getMedicalCheckTypeSelect();
        } else {
            this.employeeForm.get('medicalCheckTypeId')?.clearValidators();
        }

        this.employeeForm.get('medicalCheckTypeId')?.updateValueAndValidity();
    }
}