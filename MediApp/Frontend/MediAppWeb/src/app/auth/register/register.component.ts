import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { UserService } from 'src/app/@core/services/user.service';
import { AddUserCommand, UserData } from 'src/app/@core/data/userclasses/user';
import { Router } from '@angular/router';
import { CountyData } from 'src/app/@core/data/county';
import { GenderData } from 'src/app/@core/data/gender';
import { CountryData } from 'src/app/@core/data/country';
import { CityData } from 'src/app/@core/data/city';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';

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
              private genderData: GenderData) { }

  countrySelectList: SelectItemsList = new SelectItemsList();
  countySelectList: SelectItemsList = new SelectItemsList();
  citySelectList: SelectItemsList = new SelectItemsList();
  genderSelectList: SelectItemsList = new SelectItemsList();


  ngOnInit(): void {
      this.initForm();
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
        cNP: new FormControl('', [Validators.required, Validators.pattern('\b[1-8]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[1-9]|[1-4]\d|5[0-2]|99)\d{4}\b')]),
        phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?([0-9]{3}(\s|\.|\-|)){2}$')]),
        countryId: new FormControl('', [Validators.required]),
        countyId: new FormControl('', [Validators.required]),
        cityId: new FormControl('', [Validators.required]),
        genderId: new FormControl('', [Validators.required])
    })
  }

  getGendersSelect() {
    this.genderData.GetGendersDropdown().subscribe((genders: SelectItemsList) => {
      this.genderSelectList = genders;
    },
    error => {
        this.uiService.showSnackbar(error.message, null, 3000);
    })
  }

  getCountriesSelect() {
    this.countryData.GetCountriesDropdown().subscribe((countries: SelectItemsList) => {
      this.countrySelectList = countries;
    },
    error => {
        this.uiService.showSnackbar(error.message, null, 3000);
    })
  }

  getCountiesSelect(event: any) {
    console.log(event);
  }

  getCitiesSelect(event: any) {
    console.log(event);
  }

  onSubmit(form: NgForm) {
    this.isLoading = true;
    const addUserCommand: AddUserCommand = {
        email: form.value.email,
        password: form.value.password,
        firstName: form.value.firstName,
        middleName: form.value.middleName,
        lastName: form.value.lastName,
        address: form.value.address,
        streetName: form.value.streetName,
        cNP: form.value.cnp,
        phoneNumber: form.value.phoneNumber,
        countryId: form.value.countryId,
        countyId: form.value.countyId,
        cityId: form.value.cityId,
        genderId: form.value.genderId
    } as AddUserCommand;
    this.userData.AddUser(addUserCommand).subscribe(x => {
        this.isLoading = false;
        this.uiService.showSnackbar('You successfully registered! Welcome!', null, 3000);
        this.router.navigate(['']);
    }, error => {
        this.isLoading = false;
        this.uiService.showSnackbar(error.message, null, 3000);
    })
  }
}
