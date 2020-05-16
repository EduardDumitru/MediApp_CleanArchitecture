import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { UserService } from 'src/app/@core/services/user.service';
import { AddUserCommand, UserData } from 'src/app/@core/data/userclasses/user';
import { Router } from '@angular/router';
import { CountyData } from 'src/app/@core/data/county';
import { GenderData } from 'src/app/@core/data/gender';
import { CountryData } from 'src/app/@core/data/country';
import { CityData } from 'src/app/@core/data/city';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  registerForm: FormGroup;
  constructor(private userData: UserData, private uiService: UIService, private router: Router,
              private countryData: CountryData, private countyData: CountyData, private cityData: CityData,
              private genderData: GenderData, private authService: AuthService) { }

  countrySelectList: SelectItemsList = new SelectItemsList();
  countySelectList: SelectItemsList = new SelectItemsList();
  citySelectList: SelectItemsList = new SelectItemsList();
  genderSelectList: SelectItemsList = new SelectItemsList();


  ngOnInit(): void {
      this.initForm();
      this.getCountriesSelect();
      this.getGendersSelect();
  }

  initForm() {
    this.registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]),
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
    })
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
        this.uiService.showErrorSnackbar(error.message, null, 3000);
    })
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

  onSubmit() {
    this.isLoading = true;
    const addUserCommand: AddUserCommand = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName,
        middleName: this.registerForm.value.middleName,
        lastName: this.registerForm.value.lastName,
        address: this.registerForm.value.address,
        streetName: this.registerForm.value.streetName,
        streetNo: this.registerForm.value.streetNo,
        cnp: this.registerForm.value.cnp,
        phoneNumber: this.registerForm.value.phoneNumber,
        countryId: +this.registerForm.value.countryId,
        countyId: +this.registerForm.value.countyId,
        cityId: +this.registerForm.value.cityId,
        genderId: +this.registerForm.value.genderId
    } as AddUserCommand;
    console.log(addUserCommand);
    this.userData.AddUser(addUserCommand).subscribe(res => {
        this.isLoading = false;
        this.authService.setToken(res.token)
        this.uiService.showSuccessSnackbar('You successfully registered! Welcome!', null, 3000);
        this.authService.initAuthListener();
    }, error => {
        this.isLoading = false;
        this.uiService.showErrorSnackbar(error.message, null, 3000);
    })
  }
}
