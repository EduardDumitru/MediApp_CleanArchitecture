import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CountryData, CountryDetails, UpdateCountryCommand, AddCountryCommand, RestoreCountryCommand } from 'src/app/@core/data/country';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { Location } from '@angular/common';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
    isLoading = false;
    countryForm: FormGroup;
    countryId: number;
    isDeleted = false;
    constructor(private countryData: CountryData, private uiService: UIService,
      private route: ActivatedRoute, private _location: Location) { }

    ngOnInit() {
        if (Number(this.route.snapshot.params.id)) {
            this.countryId = +this.route.snapshot.params.id;
        }
        this.initForm();
    }

    initForm() {
        this.countryForm = new FormGroup({
            name: new FormControl('', [Validators.required])
        })
        if (this.countryId) {
            this.getCountry();
        }
    }

    getCountry() {
        this.isLoading = true;
        this.countryData.GetCountryDetails(this.countryId).subscribe((country: CountryDetails) => {
            this.countryForm.setValue({name: country.name});
            this.isDeleted = country.deleted;
            if (this.isDeleted) {
                this.countryForm.disable();
            }
            this.isLoading = false;
        },
            error => {
                this.uiService.showErrorSnackbar(error.message, null, 3000);
                this.isLoading = false;
            });
    }

    onSubmit() {
        this.isLoading = true;
        if (this.countryId) {
            this.updateCountry();
        } else {
            this.addCountry();
        }
    }

    updateCountry() {
        const updateCountryCommand: UpdateCountryCommand = {
            id: this.countryId,
            name: this.countryForm.value.name
        } as UpdateCountryCommand;

        this.countryData.UpdateCountry(updateCountryCommand).subscribe((res: Result) => {
            this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
            this._location.back();
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this.uiService.showErrorSnackbar(error.message, null, 3000);
        });
    }

    addCountry() {
        const addCountryCommand: AddCountryCommand = {
            name: this.countryForm.value.name
        } as AddCountryCommand;

        this.countryData.AddCountry(addCountryCommand).subscribe((res: Result) => {
            this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
            this._location.back();
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this.uiService.showErrorSnackbar(error.message, null, 3000);
        });
    }

    deleteCountry() {
        this.isLoading = true;
        this.countryData.DeleteCountry(this.countryId).subscribe((res: Result) => {
            this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
            this._location.back();
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this.uiService.showErrorSnackbar(error.message, null, 3000);
        })
    }

    restoreCountry() {
        this.isLoading = true;
        const restoreCountryCommand: RestoreCountryCommand = {
            id: this.countryId
        } as RestoreCountryCommand;

        this.countryData.RestoreCountry(restoreCountryCommand).subscribe((res: Result) => {
            this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
            this._location.back();
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this.uiService.showErrorSnackbar(error.message, null, 3000);
        })
    }

    goBack() {
        this._location.back();
      }

}
