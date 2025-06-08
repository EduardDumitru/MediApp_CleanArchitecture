import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiagnosisData, DiagnosisDetails, UpdateDiagnosisCommand, AddDiagnosisCommand, RestoreDiagnosisCommand } from 'src/app/@core/data/diagnosis';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { finalize } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-diagnosis',
    templateUrl: './diagnosis.component.html',
    styleUrls: ['./diagnosis.component.scss'],
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
})
export class DiagnosisComponent implements OnInit {
    isLoading = false;
    diagnosisForm!: FormGroup;
    diagnosisId?: number;
    isDeleted = false;

    // Dependency injection using inject function
    private readonly diagnosisData = inject(DiagnosisData);
    private readonly uiService = inject(UIService);
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);
    private readonly fb = inject(FormBuilder);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.params['id']);
        if (id) {
            this.diagnosisId = id;
        }
        this.initForm();
    }

    initForm(): void {
        this.diagnosisForm = this.fb.group({
            name: ['', [Validators.required]]
        });

        if (this.diagnosisId) {
            this.getDiagnosis();
        }
    }

    getDiagnosis(): void {
        this.isLoading = true;
        this.diagnosisData.GetDiagnosisDetails(this.diagnosisId!)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((diagnosis: DiagnosisDetails) => {
                if (!diagnosis) return;

                this.diagnosisForm.setValue({ name: diagnosis.name });
                this.isDeleted = !!diagnosis.deleted;

                if (this.isDeleted) {
                    this.diagnosisForm.disable();
                }
            });
    }

    onSubmit(): void {
        if (this.diagnosisForm.invalid) {
            return;
        }

        this.isLoading = true;

        if (this.diagnosisId) {
            this.updateDiagnosis();
        } else {
            this.addDiagnosis();
        }
    }

    updateDiagnosis(): void {
        const updateDiagnosisCommand: UpdateDiagnosisCommand = {
            id: this.diagnosisId!,
            name: this.diagnosisForm.value.name
        };

        this.diagnosisData.UpdateDiagnosis(updateDiagnosisCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    addDiagnosis(): void {
        const addDiagnosisCommand: AddDiagnosisCommand = {
            name: this.diagnosisForm.value.name
        };

        this.diagnosisData.AddDiagnosis(addDiagnosisCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    deleteDiagnosis(): void {
        this.isLoading = true;

        this.diagnosisData.DeleteDiagnosis(this.diagnosisId!)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    restoreDiagnosis(): void {
        this.isLoading = true;

        const restoreDiagnosisCommand: RestoreDiagnosisCommand = {
            id: this.diagnosisId!
        };

        this.diagnosisData.RestoreDiagnosis(restoreDiagnosisCommand)
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