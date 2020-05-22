import { Component, OnInit } from '@angular/core';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { Location } from '@angular/common'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClinicData, ClinicDetails, UpdateClinicCommand, AddClinicCommand, RestoreClinicCommand } from 'src/app/@core/data/clinic';
import { CountryData } from 'src/app/@core/data/country';
import { CountyData } from 'src/app/@core/data/county';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
import { CityData } from 'src/app/@core/data/city';
@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.scss']
})
export class ClinicComponent implements OnInit {
  citySelectList: SelectItemsList = new SelectItemsList();
  countrySelectList: SelectItemsList = new SelectItemsList();
  countySelectList: SelectItemsList = new SelectItemsList();
  isLoading = false;
  clinicForm: FormGroup;
  clinicId: number;
  isDeleted = false;
  constructor(private clinicData: ClinicData, private countryData: CountryData, private countyData: CountyData,
      private uiService: UIService, private route: ActivatedRoute, private _location: Location, private cityData: CityData) { }

  ngOnInit() {
      if (Number(this.route.snapshot.params.id)) {
          this.clinicId = +this.route.snapshot.params.id;
      }
      this.initForm();
      this.getCountriesSelect();
  }

  initForm() {
      this.clinicForm = new FormGroup({
          name: new FormControl('', [Validators.required]),
          countryId: new FormControl('', [Validators.required]),
          countyId: new FormControl('', [Validators.required]),
          cityId: new FormControl('', [Validators.required]),
          address: new FormControl(''),
          streetName: new FormControl(''),
          streetNo: new FormControl('', [Validators.required]),
          email: new FormControl('', [Validators.required, Validators.email]),
          phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?([0-9]{3}){2}$')])
      })
      if (this.clinicId) {
          this.getClinic();
      }
  }

  getClinic() {
      this.isLoading = true;
      this.clinicData.GetClinicDetails(this.clinicId).subscribe((clinic: ClinicDetails) => {
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
          this.isLoading = false;
      },
          error => {
              this.uiService.showErrorSnackbar(error.message, null, 3000);
              this.isLoading = false;
          });
  }

  getCountriesSelect() {
    this.countryData.GetCountriesDropdown().subscribe((countries: SelectItemsList) => {
      this.countrySelectList = countries;
    },
    error => {
        this.uiService.showErrorSnackbar(error.message, null, 3000);
    })
  }

  getCountiesSelect(countryId: string) {
    this.countyData.GetCountiesByCountryDropdown(+countryId).subscribe((counties: SelectItemsList) => {
      this.countySelectList = counties;
    },
    error => {
        this.uiService.showErrorSnackbar(error.message, null, 3000);
    })
  }

  getCitiesSelect(countyId: string) {
    this.cityData.GetCitiesByCountyDropdown(+countyId).subscribe((cities: SelectItemsList) => {
      this.citySelectList = cities;
    },
    error => {
        this.uiService.showErrorSnackbar(error.message, null, 3000);
    })
  }

  getCountiesSelectOnChange(countryId: string) {
      this.countySelectList = new SelectItemsList();
      this.citySelectList = new SelectItemsList();
      this.clinicForm.patchValue({countyId: '', cityId: ''}) ;
      this.getCountiesSelect(countryId);
  }

  onSubmit() {
      this.isLoading = true;
      if (this.clinicId) {
          this.updateClinic();
      } else {
          this.addClinic();
      }
  }

  updateClinic() {
      const updateClinicCommand: UpdateClinicCommand = {
          id: this.clinicId,
          countyId: +this.clinicForm.value.countyId,
          countryId: +this.clinicForm.value.countryId,
          cityId: +this.clinicForm.value.cityId,
          address: this.clinicForm.value.address,
          streetName: this.clinicForm.value.streetName,
          streetNo: this.clinicForm.value.streetNo,
          phoneNumber: this.clinicForm.value.phoneNumber,
          email: this.clinicForm.value.email,
          name: this.clinicForm.value.name
      } as UpdateClinicCommand;
      console.log(updateClinicCommand);
      this.clinicData.UpdateClinic(updateClinicCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  addClinic() {
      const addClinicCommand: AddClinicCommand = {
          countyId: +this.clinicForm.value.countyId,
          countryId: +this.clinicForm.value.countryId,
          cityId: +this.clinicForm.value.cityId,
          address: this.clinicForm.value.address,
          streetName: this.clinicForm.value.streetName,
          streetNo: this.clinicForm.value.streetNo,
          phoneNumber: this.clinicForm.value.phoneNumber,
          email: this.clinicForm.value.email,
          name: this.clinicForm.value.name
      } as AddClinicCommand;

      this.clinicData.AddClinic(addClinicCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      });
  }

  deleteClinic() {
      this.isLoading = true;
      this.clinicData.DeleteClinic(this.clinicId).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error.message, null, 3000);
      })
  }

  restoreClinic() {
      this.isLoading = true;
      const restoreClinicCommand: RestoreClinicCommand = {
          id: this.clinicId
      } as RestoreClinicCommand;

      this.clinicData.RestoreClinic(restoreClinicCommand).subscribe((res: Result) => {
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
