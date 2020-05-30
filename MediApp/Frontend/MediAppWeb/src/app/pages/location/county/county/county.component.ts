import { Component, OnInit } from '@angular/core';
import { CountyDetails, CountyData, UpdateCountyCommand, AddCountyCommand, RestoreCountyCommand } from 'src/app/@core/data/county';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CountryData } from 'src/app/@core/data/country';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/@core/data/common/result';
@Component({
  selector: 'app-county',
  templateUrl: './county.component.html',
  styleUrls: ['./county.component.scss']
})
export class CountyComponent implements OnInit {

  countrySelectList: SelectItemsList = new SelectItemsList();
  isLoading = false;
  countyForm: FormGroup;
  countyId: number;
  isDeleted = false;
  constructor(private countyData: CountyData, private countryData: CountryData,
      private uiService: UIService, private route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
      if (Number(this.route.snapshot.params.id)) {
          this.countyId = +this.route.snapshot.params.id;
      }
      this.initForm();
      this.getCountriesSelect();
  }

  initForm() {
      this.countyForm = new FormGroup({
          name: new FormControl('', [Validators.required]),
          countryId: new FormControl('', [Validators.required])
      })
      if (this.countyId) {
          this.getCounty();
      }
  }

  getCounty() {
      this.isLoading = true;
      this.countyData.GetCountyDetails(this.countyId).subscribe((county: CountyDetails) => {
          this.countyForm.setValue({name: county.name, countryId: county.countryId.toString()});
          this.isDeleted = county.deleted;
          if (this.isDeleted) {
              this.countyForm.disable();
          }
          this.isLoading = false;
      },
          error => {
              this.uiService.showErrorSnackbar(error, null, 3000);
              this.isLoading = false;
          });
  }

  getCountriesSelect() {
      this.countryData.GetCountriesDropdown().subscribe((countries: SelectItemsList) => {
          this.countrySelectList = countries;
      },
          error => {
              this.uiService.showErrorSnackbar(error, null, 3000);
          })
  }

  onSubmit() {
      this.isLoading = true;
      if (this.countyId) {
          this.updateCounty();
      } else {
          this.addCounty();
      }
  }

  updateCounty() {
      const updateCountyCommand: UpdateCountyCommand = {
          countryId: +this.countyForm.value.countryId,
          id: this.countyId,
          name: this.countyForm.value.name
      } as UpdateCountyCommand;
      console.log(updateCountyCommand);
      this.countyData.UpdateCounty(updateCountyCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  addCounty() {
      const addCountyCommand: AddCountyCommand = {
          countryId: +this.countyForm.value.countryId,
          name: this.countyForm.value.name
      } as AddCountyCommand;

      this.countyData.AddCounty(addCountyCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  deleteCounty() {
      this.isLoading = true;
      this.countyData.DeleteCounty(this.countyId).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      })
  }

  restoreCounty() {
      this.isLoading = true;
      const restoreCountyCommand: RestoreCountyCommand = {
          id: this.countyId
      } as RestoreCountyCommand;

      this.countyData.RestoreCounty(restoreCountyCommand).subscribe((res: Result) => {
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
          this._location.back();
          this.isLoading = false;
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      })
  }

  goBack() {
      this._location.back();
    }

}
