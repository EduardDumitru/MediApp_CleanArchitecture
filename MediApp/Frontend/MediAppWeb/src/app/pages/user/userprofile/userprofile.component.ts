import { Component, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { UserProfileData, UpdateUserProfileCommand, UserProfileDetail } from 'src/app/@core/data/userclasses/userprofile';
import { FormGroup, Validators, ValidatorFn, AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { CountryData } from 'src/app/@core/data/country';
import { CountyData } from 'src/app/@core/data/county';
import { CityData } from 'src/app/@core/data/city';
import { GenderData } from 'src/app/@core/data/gender';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { Location } from '@angular/common';
import { RoleData } from 'src/app/@core/data/role';
import { Subscription, catchError, finalize, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: 'userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;
  userProfileForm!: FormGroup;
  userProfileId = 0;
  isDeleted = false;
  userRoleName = '';

  countrySelectList: SelectItemsList = new SelectItemsList();
  countySelectList: SelectItemsList = new SelectItemsList();
  citySelectList: SelectItemsList = new SelectItemsList();
  genderSelectList: SelectItemsList = new SelectItemsList();
  roleSelectList: SelectItemsList = new SelectItemsList();

  private adminSubscription!: Subscription;
  isAdmin = false;

  // Modern dependency injection
  private userProfileData = inject(UserProfileData);
  private uiService = inject(UIService);
  private route = inject(ActivatedRoute);
  private countryData = inject(CountryData);
  private countyData = inject(CountyData);
  private cityData = inject(CityData);
  private genderData = inject(GenderData);
  private _location = inject(Location);
  private roleData = inject(RoleData);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    if (Number(this.route.snapshot.params['id'])) {
      this.userProfileId = +this.route.snapshot.params['id'];
    }

    this.adminSubscription = this.authService.isAdmin.subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });

    this.userRoleName = this.authService.UserRoleName;
    this.initForm();
    this.getGendersSelect();
    this.getCountriesSelect();
  }

  ngAfterViewInit(): void {
    this.getRolesSelect();
  }

  ngOnDestroy(): void {
    this.adminSubscription?.unsubscribe();
  }

  initForm(): void {
    this.userProfileForm = this.fb.group({
      email: [{ value: '', disabled: true }],
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
      genderId: ['', [Validators.required]],
      roleIds: [[], [Validators.required]]
    });

    this.getUserProfile();
  }

  getUserProfile(): void {
    this.isLoading = true;
    this.userProfileData.getUserProfile(this.userProfileId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe((userProfile: UserProfileDetail | null) => {
        if (!userProfile) return;

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
          genderId: userProfile.genderId.toString(),
          roleIds: userProfile.roleIds
        });

        this.getCountiesSelect(userProfile.countryId.toString());
        this.getCitiesSelect(userProfile.countyId.toString());
        this.isDeleted = userProfile.deleted ?? false;

        if (this.isDeleted) {
          this.userProfileForm.disable();
        }
      });
  }

  CnpValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = this.validateCNP(control.value);
      return valid ? null : { invalidCnp: { value: control.value } };
    };
  }

  private validateCNP(pCnp: string): boolean {
    if (!pCnp || pCnp.length !== 13) {
      return false;
    }

    let hashResult = 0;
    const cnp: number[] = [];
    const hashTable = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];

    for (let i = 0; i < 13; i++) {
      cnp[i] = parseInt(pCnp.charAt(i), 10);

      if (isNaN(cnp[i])) {
        return false;
      }

      if (i < 12) {
        hashResult = hashResult + (cnp[i] * hashTable[i]);
      }
    }

    hashResult = hashResult % 11;
    if (hashResult === 10) {
      hashResult = 1;
    }

    let year = (cnp[1] * 10) + cnp[2];

    switch (cnp[0]) {
      case 1: case 2: year += 1900; break;
      case 3: case 4: year += 1800; break;
      case 5: case 6: year += 2000; break;
      case 7: case 8: case 9:
        year += 2000;
        if (year > (new Date().getFullYear() - 14)) {
          year -= 100;
        }
        break;
      default:
        return false;
    }

    if (year < 1800 || year > 2099) {
      return false;
    }

    return (cnp[12] === hashResult);
  }

  getRolesSelect(): void {
    this.roleData.GetRolesDropdown()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe((roles: SelectItemsList) => {
        this.roleSelectList = roles;
      });
  }

  getGendersSelect(): void {
    this.genderData.GetGendersDropdown()
      .pipe(
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
    this.countyData.GetCountiesByCountryDropdown(+countryId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe((counties: SelectItemsList) => {
        this.countySelectList = counties;
      });
  }

  getCitiesSelect(countyId: string): void {
    this.cityData.GetCitiesByCountyDropdown(+countyId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe((cities: SelectItemsList) => {
        this.citySelectList = cities;
      });
  }

  getCountiesSelectOnChange(countryId: string): void {
    this.countySelectList = new SelectItemsList();
    this.citySelectList = new SelectItemsList();
    this.userProfileForm.patchValue({ countyId: '', cityId: '' });
    this.getCountiesSelect(countryId);
  }

  onSubmit(): void {
    if (this.userProfileForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.userProfileForm.value;

    const updateUserProfileCommand: UpdateUserProfileCommand = {
      id: this.userProfileId,
      firstName: formValue.firstName,
      middleName: formValue.middleName,
      lastName: formValue.lastName,
      address: formValue.address,
      streetName: formValue.streetName,
      streetNo: formValue.streetNo,
      cnp: formValue.cnp,
      phoneNumber: formValue.phoneNumber,
      countryId: +formValue.countryId,
      countyId: +formValue.countyId,
      cityId: +formValue.cityId,
      genderId: +formValue.genderId,
      roleIds: formValue.roleIds?.map((id: string) => +id) || []
    };

    this.userProfileData.updateUserProfile(updateUserProfileCommand)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(res => {
        if (res) {
          this.uiService.showSuccessSnackbar(res.successMessage, undefined, 3000);
        }
      });
  }

  goBack(): void {
    this._location.back();
  }
}