import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenderData, GenderDetails, UpdateGenderCommand, AddGenderCommand, RestoreGenderCommand } from 'src/app/@core/data/gender';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { Location } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-gender',
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
    templateUrl: './gender.component.html',
    styleUrls: ['./gender.component.scss']
})
export class GenderComponent implements OnInit {
    isLoading = false;
    genderForm!: FormGroup;
    genderId = 0;
    isDeleted = false;

    // Modern dependency injection
    private genderData = inject(GenderData);
    private uiService = inject(UIService);
    private route = inject(ActivatedRoute);
    private _location = inject(Location);
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        if (Number(this.route.snapshot.params['id'])) {
            this.genderId = +this.route.snapshot.params['id'];
        }
        this.initForm();
    }

    initForm(): void {
        this.genderForm = this.fb.group({
            name: ['', [Validators.required]]
        });

        if (this.genderId) {
            this.getGender();
        }
    }

    getGender(): void {
        this.isLoading = true;
        this.genderData.GetGenderDetails(this.genderId)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of(null);
                }),
                finalize(() => this.isLoading = false)
            )
            .subscribe((gender: GenderDetails | null) => {
                if (!gender) return;

                this.genderForm.setValue({ name: gender.name });
                this.isDeleted = gender.deleted || false;

                if (this.isDeleted) {
                    this.genderForm.disable();
                }
            });
    }

    onSubmit(): void {
        if (this.genderForm.invalid) {
            return;
        }

        this.isLoading = true;
        if (this.genderId) {
            this.updateGender();
        } else {
            this.addGender();
        }
    }

    updateGender(): void {
        const updateGenderCommand: UpdateGenderCommand = {
            id: this.genderId,
            name: this.genderForm.value.name
        };

        this.genderData.UpdateGender(updateGenderCommand)
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
                this._location.back();
            });
    }

    addGender(): void {
        const addGenderCommand: AddGenderCommand = {
            name: this.genderForm.value.name
        };

        this.genderData.AddGender(addGenderCommand)
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
                this._location.back();
            });
    }

    deleteGender(): void {
        this.isLoading = true;
        this.genderData.DeleteGender(this.genderId)
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
                this._location.back();
            });
    }

    restoreGender(): void {
        this.isLoading = true;
        const restoreGenderCommand: RestoreGenderCommand = {
            id: this.genderId
        };

        this.genderData.RestoreGender(restoreGenderCommand)
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
                this._location.back();
            });
    }

    goBack(): void {
        this._location.back();
    }
}