import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import {
    EmployeeTypeData,
    EmployeeTypeDetails,
    UpdateEmployeeTypeCommand,
    AddEmployeeTypeCommand,
    RestoreEmployeeTypeCommand
} from 'src/app/@core/data/employeetype';
import { UIService } from 'src/app/shared/ui.service';
import { Result } from 'src/app/@core/data/common/result';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-employeetype',
    templateUrl: './employeetype.component.html',
    styleUrls: ['./employeetype.component.scss'],
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
})
export class EmployeetypeComponent implements OnInit {
    isLoading = false;
    employeeTypeForm!: FormGroup;
    employeeTypeId?: number;
    isDeleted = false;

    // Dependency injection using inject function
    private readonly employeeTypeData = inject(EmployeeTypeData);
    private readonly uiService = inject(UIService);
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);
    private readonly fb = inject(FormBuilder);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.params['id']);
        if (id) {
            this.employeeTypeId = id;
        }
        this.initForm();
    }

    initForm(): void {
        this.employeeTypeForm = this.fb.group({
            name: ['', [Validators.required]]
        });

        if (this.employeeTypeId) {
            this.getEmployeeType();
        }
    }

    getEmployeeType(): void {
        this.isLoading = true;
        this.employeeTypeData.GetEmployeeTypeDetails(this.employeeTypeId!)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of({} as EmployeeTypeDetails);
                }),
                finalize(() => this.isLoading = false)
            )
            .subscribe((employeeType: EmployeeTypeDetails) => {
                if (!employeeType) return;

                this.employeeTypeForm.setValue({ name: employeeType.name });
                this.isDeleted = !!employeeType.deleted;

                if (this.isDeleted) {
                    this.employeeTypeForm.disable();
                }
            });
    }

    onSubmit(): void {
        if (this.employeeTypeForm.invalid) {
            return;
        }

        this.isLoading = true;

        if (this.employeeTypeId) {
            this.updateEmployeeType();
        } else {
            this.addEmployeeType();
        }
    }

    updateEmployeeType(): void {
        const updateEmployeeTypeCommand: UpdateEmployeeTypeCommand = {
            id: this.employeeTypeId!,
            name: this.employeeTypeForm.value.name
        };

        this.employeeTypeData.UpdateEmployeeType(updateEmployeeTypeCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    addEmployeeType(): void {
        const addEmployeeTypeCommand: AddEmployeeTypeCommand = {
            name: this.employeeTypeForm.value.name
        };

        this.employeeTypeData.AddEmployeeType(addEmployeeTypeCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    deleteEmployeeType(): void {
        this.isLoading = true;

        this.employeeTypeData.DeleteEmployeeType(this.employeeTypeId!)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    restoreEmployeeType(): void {
        this.isLoading = true;

        const restoreEmployeeTypeCommand: RestoreEmployeeTypeCommand = {
            id: this.employeeTypeId!
        };

        this.employeeTypeData.RestoreEmployeeType(restoreEmployeeTypeCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    goBack(): void {
        this.location.back();
    }
}