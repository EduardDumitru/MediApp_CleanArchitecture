import { Component, OnInit, inject } from '@angular/core';
import { CountyDetails, CountyData, UpdateCountyCommand, AddCountyCommand, RestoreCountyCommand } from 'src/app/@core/data/county';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryData } from 'src/app/@core/data/country';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { catchError, finalize, of } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-county',
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
    templateUrl: './county.component.html',
    styleUrls: ['./county.component.scss']
})
export class CountyComponent implements OnInit {
    countrySelectList = new SelectItemsList();
    isLoading = false;
    countyForm!: FormGroup;
    countyId?: number;
    isDeleted?: boolean = false;

    // Modern dependency injection
    private countyData = inject(CountyData);
    private countryData = inject(CountryData);
    private uiService = inject(UIService);
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        if (Number(this.route.snapshot.params['id'])) {
            this.countyId = +this.route.snapshot.params['id'];
        }

        this.initForm();
        this.getCountriesSelect();
    }

    initForm(): void {
        this.countyForm = this.fb.group({
            name: ['', [Validators.required]],
            countryId: ['', [Validators.required]]
        });

        if (this.countyId) {
            this.getCounty();
        }
    }

    getCounty(): void {
        this.isLoading = true;
        this.countyData.GetCountyDetails(this.countyId!)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of({} as CountyDetails);
                }),
                finalize(() => this.isLoading = false)
            )
            .subscribe((county: CountyDetails) => {
                if (!county) return;

                this.countyForm.setValue({
                    name: county.name,
                    countryId: county.countryId.toString()
                });

                this.isDeleted = county.deleted;

                if (this.isDeleted) {
                    this.countyForm.disable();
                }
            });
    }

    getCountriesSelect(): void {
        this.countryData.GetCountriesDropdown()
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of(new SelectItemsList());
                })
            )
            .subscribe(countries => {
                this.countrySelectList = countries;
            });
    }

    onSubmit(): void {
        if (this.countyForm.invalid) {
            return;
        }

        this.isLoading = true;

        if (this.countyId) {
            this.updateCounty();
        } else {
            this.addCounty();
        }
    }

    updateCounty(): void {
        const updateCountyCommand: UpdateCountyCommand = {
            countryId: +this.countyForm.value.countryId,
            id: this.countyId!,
            name: this.countyForm.value.name
        };

        this.countyData.UpdateCounty(updateCountyCommand)
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

    addCounty(): void {
        const addCountyCommand: AddCountyCommand = {
            countryId: +this.countyForm.value.countryId,
            name: this.countyForm.value.name
        };

        this.countyData.AddCounty(addCountyCommand)
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

    deleteCounty(): void {
        this.isLoading = true;

        this.countyData.DeleteCounty(this.countyId!)
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

    restoreCounty(): void {
        this.isLoading = true;

        const restoreCountyCommand: RestoreCountyCommand = {
            id: this.countyId!
        };

        this.countyData.RestoreCounty(restoreCountyCommand)
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