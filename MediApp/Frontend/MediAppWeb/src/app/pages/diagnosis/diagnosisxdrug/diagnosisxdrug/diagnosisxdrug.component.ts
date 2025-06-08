import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DiagnosisXDrugData, AddDiagnosisXDrugCommand } from 'src/app/@core/data/diagnosisxdrug';
import { UIService } from 'src/app/shared/ui.service';
import { Result } from 'src/app/@core/data/common/result';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { DiagnosisData } from 'src/app/@core/data/diagnosis';
import { DrugData } from 'src/app/@core/data/drug';
import { finalize } from 'rxjs';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-diagnosisxdrug',
    templateUrl: './diagnosisxdrug.component.html',
    styleUrls: ['./diagnosisxdrug.component.scss'],
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
})
export class DiagnosisXDrugComponent implements OnInit {
    isLoading = false;
    diagnosisXDrugForm!: FormGroup;
    diagnosisSelectList: SelectItemsList = new SelectItemsList();
    drugSelectList: SelectItemsList = new SelectItemsList();

    // Dependency injection using inject function
    private readonly diagnosisXDrugData = inject(DiagnosisXDrugData);
    private readonly uiService = inject(UIService);
    private readonly location = inject(Location);
    private readonly diagnosisData = inject(DiagnosisData);
    private readonly drugData = inject(DrugData);
    private readonly fb = inject(FormBuilder);

    ngOnInit(): void {
        this.initForm();
        this.getDiagnosesSelect();
        this.getDrugsSelect();
    }

    initForm(): void {
        this.diagnosisXDrugForm = this.fb.group({
            diagnosisId: ['', [Validators.required]],
            drugId: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.diagnosisXDrugForm.invalid) {
            return;
        }

        this.isLoading = true;
        this.addDiagnosisXDrug();
    }

    addDiagnosisXDrug(): void {
        const formValues = this.diagnosisXDrugForm.value;

        const addDiagnosisXDrugCommand: AddDiagnosisXDrugCommand = {
            diagnosisId: +formValues.diagnosisId,
            drugId: +formValues.drugId
        };

        this.diagnosisXDrugData.AddDiagnosisXDrug(addDiagnosisXDrugCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    getDiagnosesSelect(): void {
        this.diagnosisData.GetDiagnosesDropdown()
            .subscribe((diagnoses: SelectItemsList) => {
                this.diagnosisSelectList = diagnoses;
            });
    }

    getDrugsSelect(): void {
        this.drugData.GetDrugsDropdown()
            .subscribe((drugs: SelectItemsList) => {
                this.drugSelectList = drugs;
            });
    }

    goBack(): void {
        this.location.back();
    }
}