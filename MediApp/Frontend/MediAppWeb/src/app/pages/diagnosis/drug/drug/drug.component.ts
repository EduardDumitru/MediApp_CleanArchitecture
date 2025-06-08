import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DrugData, DrugDetails, UpdateDrugCommand, AddDrugCommand, RestoreDrugCommand } from 'src/app/@core/data/drug';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { finalize } from 'rxjs';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-drug',
    templateUrl: './drug.component.html',
    styleUrls: ['./drug.component.scss'],
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
})
export class DrugComponent implements OnInit {
    isLoading = false;
    drugForm!: FormGroup;
    drugId?: number;
    isDeleted = false;

    // Dependency injection using inject function
    private readonly drugData = inject(DrugData);
    private readonly uiService = inject(UIService);
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);
    private readonly fb = inject(FormBuilder);

    ngOnInit(): void {
        const id = Number(this.route.snapshot.params['id']);
        if (id) {
            this.drugId = id;
        }
        this.initForm();
    }

    initForm(): void {
        this.drugForm = this.fb.group({
            name: ['', [Validators.required]]
        });

        if (this.drugId) {
            this.getDrug();
        }
    }

    getDrug(): void {
        this.isLoading = true;
        this.drugData.GetDrugDetails(this.drugId!)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((drug: DrugDetails) => {
                if (!drug) return;

                this.drugForm.setValue({ name: drug.name });
                this.isDeleted = !!drug.deleted;

                if (this.isDeleted) {
                    this.drugForm.disable();
                }
            });
    }

    onSubmit(): void {
        if (this.drugForm.invalid) {
            return;
        }

        this.isLoading = true;

        if (this.drugId) {
            this.updateDrug();
        } else {
            this.addDrug();
        }
    }

    updateDrug(): void {
        const updateDrugCommand: UpdateDrugCommand = {
            id: this.drugId!,
            name: this.drugForm.value.name
        };

        this.drugData.UpdateDrug(updateDrugCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    addDrug(): void {
        const addDrugCommand: AddDrugCommand = {
            name: this.drugForm.value.name
        };

        this.drugData.AddDrug(addDrugCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    deleteDrug(): void {
        this.isLoading = true;

        this.drugData.DeleteDrug(this.drugId!)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    restoreDrug(): void {
        this.isLoading = true;

        const restoreDrugCommand: RestoreDrugCommand = {
            id: this.drugId!
        };

        this.drugData.RestoreDrug(restoreDrugCommand)
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