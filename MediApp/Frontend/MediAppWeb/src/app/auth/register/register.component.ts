import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil, catchError, finalize, of } from 'rxjs';

// Services and data
import { UIService } from 'src/app/shared/ui.service';
import { AddUserCommand, UserData } from 'src/app/@core/data/userclasses/user';
import { CountyData } from 'src/app/@core/data/county';
import { GenderData } from 'src/app/@core/data/gender';
import { CountryData } from 'src/app/@core/data/country';
import { CityData } from 'src/app/@core/data/city';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { AuthService } from '../auth.service';

import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class RegisterComponent implements OnInit, OnDestroy {
  isLoading = false;
  registerForm!: FormGroup;

  countrySelectList: SelectItemsList = new SelectItemsList();
  countySelectList: SelectItemsList = new SelectItemsList();
  citySelectList: SelectItemsList = new SelectItemsList();
  genderSelectList: SelectItemsList = new SelectItemsList();

  // Dependency injection using inject function
  private readonly userData = inject(UserData);
  private readonly uiService = inject(UIService);
  private readonly router = inject(Router);
  private readonly countryData = inject(CountryData);
  private readonly countyData = inject(CountyData);
  private readonly cityData = inject(CityData);
  private readonly genderData = inject(GenderData);
  private readonly authService = inject(AuthService);
  private readonly location = inject(Location);
  private readonly fb = inject(FormBuilder);

  // Stream to handle unsubscription
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.authService.authChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((authChange: boolean) => {
        if (authChange === true) {
          this.router.navigate(['']);
        } else {
          this.initForm();
          this.getCountriesSelect();
          this.getGendersSelect();
        }
      });
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
      ]],
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      address: [''],
      streetName: [''],
      streetNo: ['', [Validators.required]],
      cnp: ['', [Validators.required, this.CnpValidator()]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?([0-9]{3}){2}$')
      ]],
      countryId: ['', [Validators.required]],
      countyId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      genderId: ['', [Validators.required]]
    });
  }

  CnpValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const isValid = this.validateCNP(control.value);
      return !isValid ? { invalidCnp: { value: control.value } } : null;
    };
  }

  private validateCNP(pCnp: string): boolean {
    if (!pCnp || typeof pCnp !== 'string') {
      return false;
    }

    let i = 0;
    let year = 0;
    let hashResult = 0;
    const cnp = [];
    const hashTable = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];

    if (pCnp.length !== 13) { return false; }

    for (i = 0; i < 13; i++) {
      cnp[i] = parseInt(pCnp.charAt(i), 10);
      if (isNaN(cnp[i])) { return false; }
      if (i < 12) { hashResult = hashResult + (cnp[i] * hashTable[i]); }
    }

    hashResult = hashResult % 11;
    if (hashResult === 10) { hashResult = 1; }

    year = (cnp[1] * 10) + cnp[2];
    switch (cnp[0]) {
      case 1:
      case 2: year += 1900; break;
      case 3:
      case 4: year += 1800; break;
      case 5:
      case 6: year += 2000; break;
      case 7:
      case 8:
      case 9: {
        year += 2000;
        if (year > (new Date().getFullYear() - 14)) { year -= 100; }
        break;
      }
      default: return false;
    }

    if (year < 1800 || year > 2099) { return false; }
    return (cnp[12] === hashResult);
  }

  getGendersSelect(): void {
    this.genderData.GetGendersDropdown()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe((genders: SelectItemsList) => {
        this.genderSelectList = genders;
      });
  }

  getCountriesSelect(): void {
    this.countryData.GetCountriesDropdown()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe((countries: SelectItemsList) => {
        this.countrySelectList = countries;
      });
  }

  getCountiesSelect(countryId: string): void {
    if (!countryId) return;

    this.countyData.GetCountiesByCountryDropdown(+countryId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe((counties: SelectItemsList) => {
        this.countySelectList = counties;
        this.registerForm.get('countyId')?.setValue('');
        this.registerForm.get('cityId')?.setValue('');
        this.citySelectList = new SelectItemsList();
      });
  }

  getCitiesSelect(countyId: string): void {
    if (!countyId) return;

    this.cityData.GetCitiesByCountyDropdown(+countyId)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((cities: SelectItemsList) => {
        this.citySelectList = cities;
        this.registerForm.get('cityId')?.setValue('');
      });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValues = this.registerForm.value;

    const addUserCommand: AddUserCommand = {
      email: formValues.email,
      password: formValues.password,
      firstName: formValues.firstName,
      middleName: formValues.middleName,
      lastName: formValues.lastName,
      address: formValues.address,
      streetName: formValues.streetName,
      streetNo: formValues.streetNo,
      cnp: formValues.cnp,
      phoneNumber: formValues.phoneNumber,
      countryId: +formValues.countryId,
      countyId: +formValues.countyId,
      cityId: +formValues.cityId,
      genderId: +formValues.genderId
    } as AddUserCommand;

    this.userData.AddUser(addUserCommand)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe(res => {
        if (!res) return;

        this.authService.setToken(res.token);
        this.uiService.showSuccessSnackbar('You successfully registered! Welcome!', undefined, 3000);
        this.authService.initAuthListener();
        this.router.navigate(['']);
      });
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions at once
    this.destroy$.next();
    this.destroy$.complete();
  }
}