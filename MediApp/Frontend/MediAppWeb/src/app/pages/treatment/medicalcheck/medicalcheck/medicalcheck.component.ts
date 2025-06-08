import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError, finalize, of } from 'rxjs';

// Data services
import { MedicalCheckData, AddMedicalCheckCommand, MedicalChecksToAddLookup, MedicalChecksToAddList, MedicalChecksToAddQuery } from 'src/app/@core/data/medicalcheck';
import { CountryData, CountryFromEmployeesDropdownQuery } from 'src/app/@core/data/country';
import { CountyData, CountyFromEmployeesDropdownQuery } from 'src/app/@core/data/county';
import { CityData, CityFromEmployeesDropdownQuery } from 'src/app/@core/data/city';
import { ClinicData } from 'src/app/@core/data/clinic';
import { EmployeeData, EmployeeDropdownQuery } from 'src/app/@core/data/employee';
import { MedicalCheckTypeData, MedicalCheckTypeFromClinicDropdownQuery } from 'src/app/@core/data/medicalchecktype';
import { UserProfileData } from 'src/app/@core/data/userclasses/userprofile';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { Result } from 'src/app/@core/data/common/result';

// Services
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from 'src/app/auth/auth.service';

// Components
import { AddMedicalCheckPopupComponent } from './addmedicalcheckpopup.component';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-medicalcheck',
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
  templateUrl: './medicalcheck.component.html',
  styleUrls: ['./medicalcheck.component.scss']
})
export class MedicalCheckComponent implements OnInit, AfterViewInit, OnDestroy {
  // Form and status properties
  medicalCheckForm!: FormGroup;
  isLoading = false;
  isDeleted = false;

  // User role and ID
  currentUserId = -1;
  isDoctor = false;
  isNurse = false;
  isAdmin = false;

  // Dropdown data
  employeeSelectList = new SelectItemsList();
  countrySelectList = new SelectItemsList();
  countySelectList = new SelectItemsList();
  citySelectList = new SelectItemsList();
  clinicSelectList = new SelectItemsList();
  medicalCheckTypeSelectList = new SelectItemsList();
  userSelectList = new SelectItemsList();

  // Selected values
  clinicName = '';
  employeeName = '';
  medicalCheckTypeName = '';
  selectedAppointment: Date | null = null;

  // Date handling
  minDate = new Date();

  // Table configuration
  displayedColumns = ['appointment', 'medicalCheckTypeName', 'clinicName', 'employeeName'];
  dataSource = new MatTableDataSource<MedicalChecksToAddLookup>();

  // Subscriptions
  private subscriptions = new Map<string, Subscription>();

  // ViewChild references
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Modern dependency injection
  private medicalCheckData = inject(MedicalCheckData);
  private uiService = inject(UIService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private countryData = inject(CountryData);
  private employeeData = inject(EmployeeData);
  private countyData = inject(CountyData);
  private cityData = inject(CityData);
  private medicalCheckTypeData = inject(MedicalCheckTypeData);
  private clinicData = inject(ClinicData);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private userProfileData = inject(UserProfileData);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    // Track subscriptions for easy cleanup
    this.subscriptions.set('currentUserId',
      this.authService.currentUserId.subscribe(userId => {
        this.currentUserId = userId;
        this.initForm();
      })
    );

    this.minDate = this.getMinDate();
    this.getCountriesSelect();
    this.setupUserRoleSubscriptions();
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewInit(): void {
    if (this.isDoctor || this.isNurse || this.isAdmin) {
      this.getUsersSelect();
    }

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setupUserRoleSubscriptions(): void {
    this.subscriptions.set('isDoctor',
      this.authService.isDoctor.subscribe(isDoctor => this.isDoctor = isDoctor)
    );

    this.subscriptions.set('isNurse',
      this.authService.isNurse.subscribe(isNurse => this.isNurse = isNurse)
    );

    this.subscriptions.set('isAdmin',
      this.authService.isAdmin.subscribe(isAdmin => this.isAdmin = isAdmin)
    );
  }

  myFilter = (date: Date | null): boolean => {
    const day = (date || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  getMinDate(): Date {
    const tempDate = new Date();
    const day = tempDate.getDay();

    // Adjust date for weekends
    if (day === 0) { // Sunday
      tempDate.setDate(tempDate.getDate() + 1);
      return tempDate;
    }

    if (day === 6) { // Saturday
      tempDate.setDate(tempDate.getDate() + 2);
      return tempDate;
    }

    return tempDate;
  }

  initForm(): void {
    this.medicalCheckForm = this.fb.group({
      appointment: [{ value: this.minDate, disabled: true }, Validators.required],
      countryId: ['', Validators.required],
      countyId: ['', Validators.required],
      cityId: ['', Validators.required],
      clinicId: ['', Validators.required],
      medicalCheckTypeId: ['', Validators.required],
      employeeId: ['', Validators.required],
      patientId: [this.currentUserId.toString(), Validators.required]
    });
  }

  // Select handling methods
  setClinicName(event: string): void {
    const item = this.clinicSelectList.selectItems.find(x => x.value === event);
    this.clinicName = item ? item.label : '';
  }

  setMedicalCheckTypeName(event: string): void {
    const item = this.medicalCheckTypeSelectList.selectItems.find(x => x.value === event);
    this.medicalCheckTypeName = item ? item.label : '';
  }

  setEmployeeName(event: string): void {
    const item = this.employeeSelectList.selectItems.find(x => x.value === event);
    this.employeeName = item ? item.label : '';
  }

  // Data fetching methods
  getUsersSelect(): void {
    this.userProfileData.getUserProfilesDropdown()
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe(users => {
        this.userSelectList = users;
      });
  }

  getCountriesSelect(): void {
    this.medicalCheckForm.patchValue({
      countryId: '',
      countyId: '',
      cityId: '',
      clinicId: '',
      employeeId: '',
      medicalCheckTypeId: ''
    });

    const countryDropdownQuery: CountryFromEmployeesDropdownQuery = {
      appointment: new Date(this.medicalCheckForm.getRawValue().appointment)
    };

    this.countryData.GetCountriesFromEmployeesDropdown(countryDropdownQuery)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe(countries => {
        this.countrySelectList = countries;
      });
  }

  getCountiesSelect(countryId: string): void {
    this.medicalCheckForm.patchValue({
      countyId: '',
      cityId: '',
      clinicId: '',
      employeeId: '',
      medicalCheckTypeId: ''
    });

    const countyDropdownQuery: CountyFromEmployeesDropdownQuery = {
      appointment: new Date(this.medicalCheckForm.getRawValue().appointment),
      countryId: +countryId
    };

    this.countyData.GetCountiesByCountryFromEmployeesDropdown(countyDropdownQuery)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe(counties => {
        this.countySelectList = counties;
      });
  }

  getCitiesSelect(countyId: string): void {
    this.medicalCheckForm.patchValue({
      cityId: '',
      clinicId: '',
      employeeId: '',
      medicalCheckTypeId: ''
    });

    const cityDropdownQuery: CityFromEmployeesDropdownQuery = {
      appointment: new Date(this.medicalCheckForm.getRawValue().appointment),
      countyId: +countyId
    };

    this.cityData.GetCitiesByCountyFromEmployeesDropdown(cityDropdownQuery)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe(cities => {
        this.citySelectList = cities;
      });
  }

  getMedicalCheckTypeSelect(clinicId: string): void {
    this.medicalCheckForm.patchValue({
      medicalCheckTypeId: '',
      employeeId: ''
    });

    const query: MedicalCheckTypeFromClinicDropdownQuery = {
      appointment: new Date(this.medicalCheckForm.getRawValue().appointment),
      clinicId: +clinicId
    };

    this.medicalCheckTypeData.GetMedicalCheckTypesByClinicDropdown(query)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe(medCheckTypes => {
        this.medicalCheckTypeSelectList = medCheckTypes;
      });
  }

  getClinicSelect(): void {
    this.medicalCheckForm.patchValue({
      clinicId: '',
      employeeId: '',
      medicalCheckTypeId: ''
    });

    const { countryId, countyId, cityId } = this.medicalCheckForm.value;

    if (!countryId || !countyId || !cityId) return;

    this.clinicData.GetClinicsDropdown(+countryId, +countyId, +cityId)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        })
      )
      .subscribe(clinics => {
        this.clinicSelectList = clinics;
      });
  }

  getEmployeesSelect(): void {
    this.medicalCheckForm.patchValue({ employeeId: '' });

    const { clinicId, medicalCheckTypeId } = this.medicalCheckForm.value;
    const appointment = this.medicalCheckForm.getRawValue().appointment;

    if (!clinicId || !medicalCheckTypeId || !appointment) return;

    const query: EmployeeDropdownQuery = {
      clinicId: +clinicId,
      medicalCheckTypeId: +medicalCheckTypeId,
      appointment: new Date(appointment)
    };

    this.employeeData.GetEmployeesDropdown(query)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of(new SelectItemsList());
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(employees => {
        this.employeeSelectList = employees;
      });
  }

  // Action methods
  onSubmit(): void {
    this.isLoading = true;
    this.getMedicalChecks();
  }

  getMedicalChecks(): void {
    const { employeeId, clinicId, medicalCheckTypeId } = this.medicalCheckForm.value;
    const appointment = this.medicalCheckForm.getRawValue().appointment;

    if (!employeeId || !clinicId || !medicalCheckTypeId || !appointment) {
      this.isLoading = false;
      return;
    }

    const query: MedicalChecksToAddQuery = {
      appointment: new Date(appointment),
      employeeId: +employeeId,
      clinicId: +clinicId,
      medicalCheckTypeId: +medicalCheckTypeId
    };

    this.medicalCheckData.GetMedicalChecksToAdd(query)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          return of({ medicalChecksToAdd: [] } as MedicalChecksToAddList);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(medicalChecksList => {
        this.dataSource.data = medicalChecksList.medicalChecksToAdd;
      });
  }

  addMedicalCheck(): void {
    if (!this.selectedAppointment) return;

    const { employeeId, clinicId, medicalCheckTypeId, patientId } = this.medicalCheckForm.value;

    if (!employeeId || !clinicId || !medicalCheckTypeId || !patientId) {
      this.uiService.showErrorSnackbar('Required form fields are missing', undefined, 3000);
      return;
    }

    const command: AddMedicalCheckCommand = {
      employeeId: +employeeId,
      appointment: this.selectedAppointment,
      clinicId: +clinicId,
      medicalCheckTypeId: +medicalCheckTypeId,
      patientId: +patientId
    };

    this.isLoading = true;

    this.medicalCheckData.AddMedicalCheck(command)
      .pipe(
        catchError(error => {
          this.uiService.showErrorSnackbar(error, undefined, 3000);
          this.selectedAppointment = null;
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

  addDialogOpen(appointment: Date): void {
    this.selectedAppointment = new Date(appointment);

    const dialogRef = this.dialog.open(AddMedicalCheckPopupComponent, {
      data: {
        appointment: new Date(this.selectedAppointment),
        employeeName: this.employeeName,
        clinicName: this.clinicName,
        medicalCheckTypeName: this.medicalCheckTypeName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addMedicalCheck();
      } else {
        this.selectedAppointment = null;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}