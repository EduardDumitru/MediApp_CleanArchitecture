import { Component, OnInit } from '@angular/core';
import { UserProfileData, UpdateUserProfileCommand, UserProfileDetail } from 'src/app/@core/data/userclasses/userprofile';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CountryData } from 'src/app/@core/data/country';
import { CountyData } from 'src/app/@core/data/county';
import { CityData } from 'src/app/@core/data/city';
import { GenderData } from 'src/app/@core/data/gender';
import { AuthService } from 'src/app/auth/auth.service';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';

@Component({
    selector: 'app-userprofile',
    templateUrl: 'userprofile.component.html',
    styleUrls: ['./userprofile.component.scss']
})

export class UserProfileComponent implements OnInit {
    isLoading = false;
    userProfileForm: FormGroup;
    userProfileId: number;
    isDeleted = false;
    constructor(private userProfileData: UserProfileData, private uiService: UIService, private router: Router,
                private countryData: CountryData, private countyData: CountyData, private cityData: CityData,
                private genderData: GenderData, private route: ActivatedRoute) { }

    countrySelectList: SelectItemsList = new SelectItemsList();
    countySelectList: SelectItemsList = new SelectItemsList();
    citySelectList: SelectItemsList = new SelectItemsList();
    genderSelectList: SelectItemsList = new SelectItemsList();

    ngOnInit(): void {
        if (Number(this.route.snapshot.params.id)) {
            this.userProfileId = +this.route.snapshot.params.id;
        }
        this.initForm();
        this.getGendersSelect();
        this.getCountriesSelect();
    }

    initForm() {
      this.userProfileForm = new FormGroup({
          email: new FormControl({value: '', disabled: true}),
          firstName: new FormControl('', [Validators.required]),
          middleName: new FormControl(''),
          lastName: new FormControl('', [Validators.required]),
          address: new FormControl(''),
          streetName: new FormControl(''),
          streetNo: new FormControl('', [Validators.required]),
          cnp: new FormControl('', [Validators.required, this.CnpValidator()]),
          phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?([0-9]{3}){2}$')]),
          countryId: new FormControl('', [Validators.required]),
          countyId: new FormControl('', [Validators.required]),
          cityId: new FormControl('', [Validators.required]),
          genderId: new FormControl('', [Validators.required])
      });
      this.getUserProfile();
    }

    getUserProfile() {
        this.isLoading = true;
        this.userProfileData.getUserProfile(this.userProfileId).subscribe((userProfile: UserProfileDetail) => {
            this.userProfileForm.setValue({
                email: userProfile.emailAddress,
                firstName: userProfile.firstName,
                middleName: userProfile.middleName,
                lastName: userProfile.lastName,
                address: userProfile.address,
                streetName: userProfile.streetName,
                streetNo: userProfile.streetNo,
                cnp: userProfile.cnp,
                phoneNumber: userProfile.phoneNumber,
                countryId: userProfile.countryId.toString(),
                countyId: userProfile.countyId.toString(),
                cityId: userProfile.cityId.toString(),
                genderId: userProfile.genderId.toString()
            });
            this.getCountiesSelect(userProfile.countryId.toString());
            this.getCitiesSelect(userProfile.countyId.toString());
            this.isDeleted = userProfile.deleted;
            if (this.isDeleted) {
                this.userProfileForm.disable();
            }
            this.isLoading = false;
        },
            error => {
                this.uiService.showErrorSnackbar(error, null, 3000);
                this.isLoading = false;
            });
    }

    CnpValidator(): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} | null => {
        const invalid = this.validateCNP(control.value);
        return !invalid ? {invalidError: {value: control.value}} : null;
      };
    }

    private validateCNP( pCnp: string ) {
      let i = 0;
      let year = 0;
      let hashResult = 0;
      const cnp = [];
      const hashTable=[2,7,9,1,4,6,3,5,8,2,7,9];
      if( pCnp.length !== 13 ) { return false; }
      for( i=0 ; i<13 ; i++ ) {
          cnp[i] = parseInt( pCnp.charAt(i) , 10 );
          if( isNaN( cnp[i] ) ) { return false; }
          if( i < 12 ) { hashResult = hashResult + ( cnp[i] * hashTable[i] ); }
      }
      hashResult = hashResult % 11;
      if( hashResult === 10 ) { hashResult = 1; }
      year = (cnp[1]*10)+cnp[2];
      switch( cnp[0] ) {
          case 1  : case 2 : { year += 1900; } break;
          case 3  : case 4 : { year += 1800; } break;
          case 5  : case 6 : { year += 2000; } break;
          case 7  : case 8 : case 9 : { year += 2000;
            if( year > ( new Date().getFullYear() - 14 ) ) { year -= 100; } } break;
          default : { return false; }
      }
      if( year < 1800 || year > 2099 ) { return false; }
      return ( cnp[12] === hashResult );
    }

    getGendersSelect() {
      this.genderData.GetGendersDropdown().subscribe((genders: SelectItemsList) => {
        this.genderSelectList = genders;
      },
      error => {
          this.uiService.showErrorSnackbar(error, null, 3000);
      })
    }

    getCountriesSelect() {
      this.countryData.GetCountriesDropdown().subscribe((countries: SelectItemsList) => {
        this.countrySelectList = countries;
      },
      error => {
          this.uiService.showErrorSnackbar(error, null, 3000);
      })
    }

    getCountiesSelect(countryId: string) {
      this.countyData.GetCountiesByCountryDropdown(+countryId).subscribe((counties: SelectItemsList) => {
        this.countySelectList = counties;
      },
      error => {
          this.uiService.showErrorSnackbar(error, null, 3000);
      })
    }

    getCitiesSelect(countyId: string) {
      this.cityData.GetCitiesByCountyDropdown(+countyId).subscribe((cities: SelectItemsList) => {
        this.citySelectList = cities;
      },
      error => {
          this.uiService.showErrorSnackbar(error, null, 3000);
      })
    }

    getCountiesSelectOnChange(countryId: string) {
        this.countySelectList = new SelectItemsList();
        this.citySelectList = new SelectItemsList();
        this.userProfileForm.patchValue({countyId: '', cityId: ''}) ;
        this.getCountiesSelect(countryId);
    }

    onSubmit() {
      this.isLoading = true;
      const updateUserProfileCommand: UpdateUserProfileCommand = {
          id: this.userProfileId,
          firstName: this.userProfileForm.value.firstName,
          middleName: this.userProfileForm.value.middleName,
          lastName: this.userProfileForm.value.lastName,
          address: this.userProfileForm.value.address,
          streetName: this.userProfileForm.value.streetName,
          streetNo: this.userProfileForm.value.streetNo,
          cnp: this.userProfileForm.value.cnp,
          phoneNumber: this.userProfileForm.value.phoneNumber,
          countryId: +this.userProfileForm.value.countryId,
          countyId: +this.userProfileForm.value.countyId,
          cityId: +this.userProfileForm.value.cityId,
          genderId: +this.userProfileForm.value.genderId
      } as UpdateUserProfileCommand;
      this.userProfileData.updateUserProfile(updateUserProfileCommand).subscribe(res => {
          this.isLoading = false;
          this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
      }, error => {
          this.isLoading = false;
          this.uiService.showErrorSnackbar(error, null, 3000);
      })
    }
}
