import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import {
    MedicalCheckTypeData,
    MedicalCheckTypeDetails,
    UpdateMedicalCheckTypeCommand,
    AddMedicalCheckTypeCommand,
    RestoreMedicalCheckTypeCommand
} from 'src/app/@core/data/medicalchecktype';
import { UIService } from 'src/app/shared/ui.service';
import { Result } from 'src/app/@core/data/common/result';

// Material imports
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-medicalchecktype',
    templateUrl: './medicalchecktype.component.html',
    styleUrls: ['./medicalchecktype.component.scss'],
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
})
export class MedicalchecktypeComponent implements OnInit {
    isLoading = false;
    medicalCheckTypeForm!: FormGroup;
    medicalCheckTypeId?: number;
    isDeleted = false;

    // Dependency injection using inject function
    private readonly medicalCheckTypeData = inject(MedicalCheckTypeData);
    private readonly uiService = inject(UIService);
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);
    private readonly fb = inject(FormBuilder);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.params['id']);
        if (id) {
            this.medicalCheckTypeId = id;
        }
        this.initForm();
    }

    initForm(): void {
        this.medicalCheckTypeForm = this.fb.group({
            name: ['', [Validators.required]]
        });

        if (this.medicalCheckTypeId) {
            this.getMedicalCheckType();
        }
    }

    getMedicalCheckType(): void {
        this.isLoading = true;
        this.medicalCheckTypeData.GetMedicalCheckTypeDetails(this.medicalCheckTypeId!)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of({} as MedicalCheckTypeDetails);
                }),
                finalize(() => this.isLoading = false)
            )
            .subscribe((medicalCheckType: MedicalCheckTypeDetails) => {
                if (!medicalCheckType) return;

                this.medicalCheckTypeForm.setValue({ name: medicalCheckType.name });
                this.isDeleted = !!medicalCheckType.deleted;

                if (this.isDeleted) {
                    this.medicalCheckTypeForm.disable();
                }
            });
    }

    onSubmit(): void {
        if (this.medicalCheckTypeForm.invalid) {
            return;
        }

        this.isLoading = true;

        if (this.medicalCheckTypeId) {
            this.updateMedicalCheckType();
        } else {
            this.addMedicalCheckType();
        }
    }

    updateMedicalCheckType(): void {
        const updateMedicalCheckTypeCommand: UpdateMedicalCheckTypeCommand = {
            id: this.medicalCheckTypeId!,
            name: this.medicalCheckTypeForm.value.name
        };

        this.medicalCheckTypeData.UpdateMedicalCheckType(updateMedicalCheckTypeCommand)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of(null);
                }),
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    addMedicalCheckType(): void {
        const addMedicalCheckTypeCommand: AddMedicalCheckTypeCommand = {
            name: this.medicalCheckTypeForm.value.name
        };

        this.medicalCheckTypeData.AddMedicalCheckType(addMedicalCheckTypeCommand)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of(null);
                }),
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    deleteMedicalCheckType(): void {
        this.isLoading = true;

        this.medicalCheckTypeData.DeleteMedicalCheckType(this.medicalCheckTypeId!)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of(null);
                }),
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    restoreMedicalCheckType(): void {
        this.isLoading = true;

        const restoreMedicalCheckTypeCommand: RestoreMedicalCheckTypeCommand = {
            id: this.medicalCheckTypeId!
        };

        this.medicalCheckTypeData.RestoreMedicalCheckType(restoreMedicalCheckTypeCommand)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of(null);
                }),
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