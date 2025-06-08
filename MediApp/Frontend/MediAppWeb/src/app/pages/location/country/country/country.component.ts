import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryData, CountryDetails, UpdateCountryCommand, AddCountryCommand, RestoreCountryCommand } from 'src/app/@core/data/country';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { Location } from '@angular/common';
import { catchError, finalize, of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-country',
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
    templateUrl: './country.component.html',
    styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
    isLoading = false;
    countryForm!: FormGroup;
    countryId?: number;
    isDeleted?: boolean = false;

    // Modern dependency injection
    private countryData = inject(CountryData);
    private uiService = inject(UIService);
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        if (Number(this.route.snapshot.params['id'])) {
            this.countryId = +this.route.snapshot.params['id'];
        }

        this.initForm();
    }

    initForm(): void {
        this.countryForm = this.fb.group({
            name: ['', [Validators.required]]
        });

        if (this.countryId) {
            this.getCountry();
        }
    }

    getCountry(): void {
        this.isLoading = true;
        this.countryData.GetCountryDetails(this.countryId!)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of({} as CountryDetails);
                }),
                finalize(() => this.isLoading = false)
            )
            .subscribe((country: CountryDetails) => {
                if (!country) return;

                this.countryForm.setValue({ name: country.name });
                this.isDeleted = country.deleted;

                if (this.isDeleted) {
                    this.countryForm.disable();
                }
            });
    }

    onSubmit(): void {
        if (this.countryForm.invalid) return;

        this.isLoading = true;

        if (this.countryId) {
            this.updateCountry();
        } else {
            this.addCountry();
        }
    }

    updateCountry(): void {
        const updateCountryCommand: UpdateCountryCommand = {
            id: this.countryId!,
            name: this.countryForm.value.name
        };

        this.countryData.UpdateCountry(updateCountryCommand)
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

    addCountry(): void {
        const addCountryCommand: AddCountryCommand = {
            name: this.countryForm.value.name
        };

        this.countryData.AddCountry(addCountryCommand)
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

    deleteCountry(): void {
        this.isLoading = true;

        this.countryData.DeleteCountry(this.countryId!)
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

    restoreCountry(): void {
        this.isLoading = true;

        const restoreCountryCommand: RestoreCountryCommand = {
            id: this.countryId!
        };

        this.countryData.RestoreCountry(restoreCountryCommand)
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