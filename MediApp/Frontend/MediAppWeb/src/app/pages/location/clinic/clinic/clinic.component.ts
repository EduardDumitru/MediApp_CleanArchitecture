import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, Location } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { Result } from 'src/app/@core/data/common/result';
import { ClinicData, ClinicDetails, UpdateClinicCommand, AddClinicCommand, RestoreClinicCommand } from 'src/app/@core/data/clinic';
import { CountryData } from 'src/app/@core/data/country';
import { CountyData } from 'src/app/@core/data/county';
import { CityData } from 'src/app/@core/data/city';
import { UIService } from 'src/app/shared/ui.service';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-clinic',
    standalone: true,
    imports: [
        ...getSharedImports(),
    ],
    templateUrl: './clinic.component.html',
    styleUrls: ['./clinic.component.scss'],
})
export class ClinicComponent implements OnInit {
    // Properties
    citySelectList: SelectItemsList = new SelectItemsList();
    countrySelectList: SelectItemsList = new SelectItemsList();
    countySelectList: SelectItemsList = new SelectItemsList();
    isLoading = false;
    clinicForm!: FormGroup;
    clinicId?: number;
    isDeleted?: boolean = false;

    // Dependency injection using inject() function
    private clinicData = inject(ClinicData);
    private countryData = inject(CountryData);
    private countyData = inject(CountyData);
    private cityData = inject(CityData);
    private uiService = inject(UIService);
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        // Get clinic ID from route params
        const id = this.route.snapshot.params['id'];
        if (id && !isNaN(+id)) {
            this.clinicId = +id;
        }

        this.initForm();
        this.getCountriesSelect();
    }

    initForm(): void {
        this.clinicForm = this.fb.group({
            name: ['', Validators.required],
            countryId: ['', Validators.required],
            countyId: ['', Validators.required],
            cityId: ['', Validators.required],
            address: [''],
            streetName: [''],
            streetNo: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [
                Validators.required,
                Validators.pattern('^(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?([0-9]{3}){2}$')
            ]]
        });

        if (this.clinicId) {
            this.getClinic();
        }
    }

    getClinic(): void {
        this.isLoading = true;

        this.clinicData.GetClinicDetails(this.clinicId!)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((clinic: ClinicDetails) => {
                if (!clinic || !clinic.name) return;

                this.clinicForm.setValue({
                    name: clinic.name,
                    countryId: clinic.countryId.toString(),
                    countyId: clinic.countyId.toString(),
                    cityId: clinic.cityId.toString(),
                    address: clinic.address,
                    streetName: clinic.streetName,
                    streetNo: clinic.streetNo,
                    phoneNumber: clinic.phoneNumber,
                    email: clinic.email
                });

                this.getCountiesSelect(clinic.countryId.toString());
                this.getCitiesSelect(clinic.countyId.toString());
                this.isDeleted = clinic.deleted;

                if (this.isDeleted) {
                    this.clinicForm.disable();
                }
            });
    }

    getCountriesSelect(): void {
        this.countryData.GetCountriesDropdown()
            .subscribe(countries => this.countrySelectList = countries);
    }

    getCountiesSelect(countryId: string): void {
        this.countyData.GetCountiesByCountryDropdown(+countryId)
            .subscribe(counties => this.countySelectList = counties);
    }

    getCitiesSelect(countyId: string): void {
        this.cityData.GetCitiesByCountyDropdown(+countyId)
            .pipe(
                catchError(error => {
                    this.uiService.showErrorSnackbar(error, undefined, 3000);
                    return of(new SelectItemsList());
                })
            )
            .subscribe(cities => this.citySelectList = cities);
    }

    getCountiesSelectOnChange(countryId: string): void {
        this.countySelectList = new SelectItemsList();
        this.citySelectList = new SelectItemsList();
        this.clinicForm.patchValue({ countyId: '', cityId: '' });
        this.getCountiesSelect(countryId);
    }

    onSubmit(): void {
        if (this.clinicForm.invalid) return;

        this.isLoading = true;

        if (this.clinicId) {
            this.updateClinic();
        } else {
            this.addClinic();
        }
    }

    updateClinic(): void {
        const formValue = this.clinicForm.value;
        const updateClinicCommand: UpdateClinicCommand = {
            id: this.clinicId!,
            countyId: +formValue.countyId,
            countryId: +formValue.countryId,
            cityId: +formValue.cityId,
            address: formValue.address,
            streetName: formValue.streetName,
            streetNo: formValue.streetNo,
            phoneNumber: formValue.phoneNumber,
            email: formValue.email,
            name: formValue.name
        };

        this.clinicData.UpdateClinic(updateClinicCommand)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    addClinic(): void {
        const formValue = this.clinicForm.value;
        const addClinicCommand: AddClinicCommand = {
            countyId: +formValue.countyId,
            countryId: +formValue.countryId,
            cityId: +formValue.cityId,
            address: formValue.address,
            streetName: formValue.streetName,
            streetNo: formValue.streetNo,
            phoneNumber: formValue.phoneNumber,
            email: formValue.email,
            name: formValue.name
        };

        this.clinicData.AddClinic(addClinicCommand)
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

    deleteClinic(): void {
        this.isLoading = true;

        this.clinicData.DeleteClinic(this.clinicId!)
            .pipe(
                finalize(() => this.isLoading = false)
            )
            .subscribe((res: Result | null) => {
                if (!res) return;

                this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
                this.location.back();
            });
    }

    restoreClinic(): void {
        this.isLoading = true;

        const restoreClinicCommand: RestoreClinicCommand = {
            id: this.clinicId!
        };

        this.clinicData.RestoreClinic(restoreClinicCommand)
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