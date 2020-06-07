import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CityData } from 'src/app/@core/data/city';
import { MedicalCheckTypeData } from 'src/app/@core/data/medicalchecktype';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { MedicalCheckData, AddMedicalCheckCommand, MedicalChecksToAddLookup, MedicalChecksToAddList, MedicalChecksToAddQuery } from 'src/app/@core/data/medicalcheck';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { CountryData } from 'src/app/@core/data/country';
import { EmployeeData, EmployeeDropdownQuery } from 'src/app/@core/data/employee';
import { CountyData } from 'src/app/@core/data/county';
import { ClinicData } from 'src/app/@core/data/clinic';
import { Result } from 'src/app/@core/data/common/result';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMedicalCheckPopupComponent } from './addmedicalcheckpopup.component';
import { UserProfileData } from 'src/app/@core/data/userclasses/userprofile';

@Component({
  selector: 'app-medicalcheck',
  templateUrl: './medicalcheck.component.html',
  styleUrls: ['./medicalcheck.component.scss']
})
export class MedicalCheckComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading = false;
  medicalCheckForm: FormGroup;
  medicalCheckId: number;
  isDeleted = false;
  currentUserIdSubscription: Subscription;
  currentUserId = -1;
  isDoctorSubscription: Subscription;
  isDoctor = false;
  isNurseSubscription: Subscription;
  isNurse = false;
  isAdminSubscription: Subscription;
  isAdmin = false;
  employeeSelectList: SelectItemsList = new SelectItemsList();
  countrySelectList: SelectItemsList = new SelectItemsList();
  countySelectList: SelectItemsList = new SelectItemsList();
  citySelectList: SelectItemsList = new SelectItemsList();
  clinicSelectList: SelectItemsList = new SelectItemsList();
  medicalCheckTypeSelectList: SelectItemsList = new SelectItemsList();
  userSelectList: SelectItemsList = new SelectItemsList();
  clinicName = '';
  employeeName = '';
  medicalCheckTypeName = '';
  selectedAppointment: Date;
  minDate: Date = new Date();
  displayedColumns = ['appointment', 'medicalCheckTypeName', 'clinicName', 'employeeName'];
  dataSource = new MatTableDataSource<MedicalChecksToAddLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private medicalCheckData: MedicalCheckData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location, private countryData: CountryData,
    private employeeData: EmployeeData, private countyData: CountyData, private cityData: CityData,
    private medicalCheckTypeData: MedicalCheckTypeData, private clinicData: ClinicData,
    private authService: AuthService, private dialog: MatDialog, private userProfileData: UserProfileData) { }

  ngOnInit() {
    this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
      this.initForm();
    });
    this.minDate = this.getMinDate();
    this.getCountriesSelect();
    this.getCurrentUserRole();
  }

  getCurrentUserRole() {
    this.isDoctorSubscription = this.authService.isDoctor.subscribe(isDoctor => {
      this.isDoctor = isDoctor;
    });
    this.isNurseSubscription = this.authService.isNurse.subscribe(isNurse => {
      this.isNurse = isNurse;
    });
    this.isAdminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  ngOnDestroy() {
    this.currentUserIdSubscription.unsubscribe();
    this.isDoctorSubscription.unsubscribe();
    this.isNurseSubscription.unsubscribe();
    this.isAdminSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (this.isDoctor || this.isNurse || this.isAdmin) {
      this.getUsersSelect();
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  getMinDate() {
    const tempDate = new Date();
    const day = (this.minDate).getDay();
    // Prevent Saturday and Sunday from being selected.
    if (day === 0) {
      tempDate.setTime(tempDate.getTime() + 1000 * 60 * 60 * 24);
      return tempDate;
    }
    if (day === 6) {
      tempDate.setTime(tempDate.getTime() + 1000 * 60 * 60 * 48);
      return tempDate;
    }
  }

  getMedicalChecks() {
    const medicalCheckToAddQuery = {
      appointment: new Date(this.medicalCheckForm.getRawValue().appointment),
      employeeId: +this.medicalCheckForm.value.employeeId,
      clinicId: +this.medicalCheckForm.value.clinicId,
      medicalCheckTypeId: +this.medicalCheckForm.value.medicalCheckTypeId
    } as MedicalChecksToAddQuery;
    this.medicalCheckData.GetMedicalChecksToAdd(medicalCheckToAddQuery).subscribe((medicalChecksList: MedicalChecksToAddList) => {
      this.isLoading = false;
      this.dataSource.data = medicalChecksList.medicalChecksToAdd;
    }, error => {
      this.isLoading = false;
      this.uiService.showErrorSnackbar(error, null, 3000);
    });
  }

  initForm() {
    this.medicalCheckForm = new FormGroup({
      appointment: new FormControl({value: this.minDate, disabled: true}, [Validators.required]),
      countryId: new FormControl('', [Validators.required]),
      countyId: new FormControl('', [Validators.required]),
      cityId: new FormControl('', [Validators.required]),
      clinicId: new FormControl('', [Validators.required]),
      medicalCheckTypeId: new FormControl('', [Validators.required]),
      employeeId: new FormControl('', [Validators.required]),
      patientId: new FormControl(this.currentUserId.toString(), [Validators.required])
    });
  }

  setClinicName(event) {
    this.clinicName = this.clinicSelectList.selectItems.find(x => x.value === event).label;
  }

  setMedicalCheckTypeName(event) {
    this.medicalCheckTypeName = this.medicalCheckTypeSelectList.selectItems.find(x => x.value === event).label;
  }

  setEmployeeName(event) {
    this.employeeName = this.employeeSelectList.selectItems.find(x => x.value === event).label;
  }

  getUsersSelect() {
    this.userProfileData.getUserProfilesDropdown().subscribe((users: SelectItemsList) => {
      this.userSelectList = users;
    },
      error => {
        this.uiService.showErrorSnackbar(error, null, 3000);
      })
  }

  getCountriesSelect() {
    this.medicalCheckForm.patchValue({ countryId: '', countyId: '', cityId: '', clinicId: '', employeeId: '', medicalCheckTypeId: '' });
    this.countryData.GetCountriesDropdown().subscribe((countries: SelectItemsList) => {
      this.countrySelectList = countries;
    },
      error => {
        this.uiService.showErrorSnackbar(error, null, 3000);
      })
  }

  getCountiesSelect(countryId: string) {
    this.medicalCheckForm.patchValue({ countyId: '', cityId: '', clinicId: '', employeeId: '', medicalCheckTypeId: '' });
    this.countyData.GetCountiesByCountryDropdown(+countryId).subscribe((counties: SelectItemsList) => {
      this.countySelectList = counties;
    },
      error => {
        this.uiService.showErrorSnackbar(error, null, 3000);
      })
  }

  getCitiesSelect(countyId: string) {
    this.medicalCheckForm.patchValue({ cityId: '', clinicId: '', employeeId: '', medicalCheckTypeId: '' });
    this.cityData.GetCitiesByCountyDropdown(+countyId).subscribe((cities: SelectItemsList) => {
      this.citySelectList = cities;
    },
      error => {
        this.uiService.showErrorSnackbar(error, null, 3000);
      })
  }

  getMedicalCheckTypeSelect() {
    this.medicalCheckForm.patchValue({ medicalCheckTypeId: '', employeeId: '' });
    this.medicalCheckTypeData.GetMedicalCheckTypesDropdown().subscribe((medCheckTypes: SelectItemsList) => {
      this.medicalCheckTypeSelectList = medCheckTypes;
    },
      error => {
        this.uiService.showErrorSnackbar(error, null, 3000);
      });
  }

  getClinicSelect() {
    this.medicalCheckForm.patchValue({ clinicId: '', employeeId: '', medicalCheckTypeId: '' });
    if (this.medicalCheckForm.value.countyId !== '' && this.medicalCheckForm.value.countyId !== '' && this.medicalCheckForm.value.cityId !== '') {
      this.clinicData.GetClinicsDropdown(+this.medicalCheckForm.value.countryId,
        +this.medicalCheckForm.value.countyId, +this.medicalCheckForm.value.cityId).subscribe((clinics: SelectItemsList) => {
        this.clinicSelectList = clinics;
      },
        error => {
          this.uiService.showErrorSnackbar(error, null, 3000);
        });
    }
  }

  getEmployeesSelect() {
    this.medicalCheckForm.patchValue({ employeeId: '' });
    if (this.medicalCheckForm.value.clinicId !== ''
    && this.medicalCheckForm.value.medicalCheckTypeId !== ''
    && this.medicalCheckForm.getRawValue().appointment !== undefined) {
      const employeeDropdownQuery = {
        clinicId: +this.medicalCheckForm.value.clinicId,
        medicalCheckTypeId: +this.medicalCheckForm.value.medicalCheckTypeId,
        appointment: new Date(this.medicalCheckForm.getRawValue().appointment)
      } as EmployeeDropdownQuery;
      this.employeeData.GetEmployeesDropdown(employeeDropdownQuery).subscribe((employees: SelectItemsList) => {
          this.employeeSelectList = employees;
        },
          error => {
            this.uiService.showErrorSnackbar(error, null, 3000);
            this.isLoading = false;
          });
    }
  }

  onSubmit() {
    this.isLoading = true;
    this.getMedicalChecks();
  }

  addMedicalCheck() {
    const addMedicalCheckCommand: AddMedicalCheckCommand = {
      employeeId: +this.medicalCheckForm.value.employeeId,
      appointment: this.selectedAppointment,
      clinicId: +this.medicalCheckForm.value.clinicId,
      medicalCheckTypeId: +this.medicalCheckForm.value.medicalCheckTypeId,
      patientId: +this.medicalCheckForm.value.patientId
    } as AddMedicalCheckCommand;
    this.medicalCheckData.AddMedicalCheck(addMedicalCheckCommand).subscribe((res: Result) => {
      this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
      this._location.back();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.selectedAppointment = null;
      this.uiService.showErrorSnackbar(error, null, 3000);
    });
  }

  addDialogOpen(appointment) {
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
    })
  }

  goBack() {
    this._location.back();
  }

}
