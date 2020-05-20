import { Component, OnInit } from '@angular/core';
import { CountryData } from 'src/app/@core/data/country';
import { CountyData } from 'src/app/@core/data/county';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { CityData, CityDetails, UpdateCityCommand, AddCityCommand, RestoreCityCommand } from 'src/app/@core/data/city';
import { Result } from 'src/app/@core/data/common/result';
import { Location } from '@angular/common';

@Component({
    selector: 'app-city',
    templateUrl: 'city.component.html',
    styleUrls: ['./city.component.scss']
})

export class CityComponent implements OnInit {

    countrySelectList: SelectItemsList = new SelectItemsList();
    countySelectList: SelectItemsList = new SelectItemsList();
    isLoading = false;
    cityForm: FormGroup;
    cityId: number;
    isDeleted = false;
    constructor(private cityData: CityData, private countryData: CountryData, private countyData: CountyData,
        private uiService: UIService, private route: ActivatedRoute, private _location: Location) { }

    ngOnInit() {
        if (Number(this.route.snapshot.params.id)) {
            this.cityId = +this.route.snapshot.params.id;
        }
        this.initForm();
        this.getCountiesSelect();
    }

    initForm() {
        this.cityForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            countyId: new FormControl('', [Validators.required])
        })
        console.log(this.cityId);
        if (this.cityId) {
            this.getCity();
        }
    }

    getCity() {
        this.isLoading = true;
        this.cityData.GetCityDetails(this.cityId).subscribe((city: CityDetails) => {
            this.cityForm.setValue({name: city.name, countyId: city.countyId.toString()});
            this.isDeleted = city.deleted;
            if (this.isDeleted) {
                this.cityForm.disable();
            }
            this.isLoading = false;
        },
            error => {
                this.uiService.showErrorSnackbar(error.message, null, 3000);
                this.isLoading = false;
            });
    }

    getCountiesSelect() {
        this.countyData.GetCountiesDropdown().subscribe((counties: SelectItemsList) => {
            this.countySelectList = counties;
        },
            error => {
                this.uiService.showErrorSnackbar(error.message, null, 3000);
            })
    }

    onSubmit() {
        this.isLoading = true;
        if (this.cityId) {
            this.updateCity();
        } else {
            this.addCity();
        }
    }

    updateCity() {
        const updateCityCommand: UpdateCityCommand = {
            countyId: +this.cityForm.value.countyId,
            id: this.cityId,
            name: this.cityForm.value.name
        } as UpdateCityCommand;
        console.log(updateCityCommand);
        this.cityData.UpdateCity(updateCityCommand).subscribe((res: Result) => {
            this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
            this._location.back();
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this.uiService.showErrorSnackbar(error.message, null, 3000);
        });
    }

    addCity() {
        const addCityCommand: AddCityCommand = {
            countyId: +this.cityForm.value.countyId,
            name: this.cityForm.value.name
        } as AddCityCommand;

        this.cityData.AddCity(addCityCommand).subscribe((res: Result) => {
            this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
            this._location.back();
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this.uiService.showErrorSnackbar(error.message, null, 3000);
        });
    }

    deleteCity() {
        this.isLoading = true;
        this.cityData.DeleteCity(this.cityId).subscribe((res: Result) => {
            this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
            this._location.back();
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            this.uiService.showErrorSnackbar(error.message, null, 3000);
        })
    }

    restoreCity() {
        this.isLoading = true;
        const restoreCityCommand: RestoreCityCommand = {
            id: this.cityId
        } as RestoreCityCommand;

        this.cityData.RestoreCity(restoreCityCommand).subscribe((res: Result) => {
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