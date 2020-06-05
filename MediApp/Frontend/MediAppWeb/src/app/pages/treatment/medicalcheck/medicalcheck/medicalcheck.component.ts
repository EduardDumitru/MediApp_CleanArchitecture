import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CityData } from 'src/app/@core/data/city';
import { MedicalCheckTypeData } from 'src/app/@core/data/medicalchecktype';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { MedicalCheckData, MedicalCheckDetails, UpdateMedicalCheckCommand, AddMedicalCheckCommand, MedicalChecksToAddLookup, MedicalChecksToAddList, MedicalChecksToAddQuery } from 'src/app/@core/data/medicalcheck';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { CountryData } from 'src/app/@core/data/country';
import { EmployeeData } from 'src/app/@core/data/employee';
import { CountyData } from 'src/app/@core/data/county';
import { ClinicData } from 'src/app/@core/data/clinic';
import { Result } from 'src/app/@core/data/common/result';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

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
  employeeSelectList: SelectItemsList = new SelectItemsList();
  countrySelectList: SelectItemsList = new SelectItemsList();
  countySelectList: SelectItemsList = new SelectItemsList();
  citySelectList: SelectItemsList = new SelectItemsList();
  clinicSelectList: SelectItemsList = new SelectItemsList();
  medicalCheckTypeSelectList: SelectItemsList = new SelectItemsList();

  displayedColumns = ['appointment', 'medicalCheckTypeName', 'clinicName', 'employeeName'];
  dataSource = new MatTableDataSource<MedicalChecksToAddLookup>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private medicalCheckData: MedicalCheckData, private uiService: UIService,
    private route: ActivatedRoute, private _location: Location, private countryData: CountryData,
    private employeeData: EmployeeData, private countyData: CountyData, private cityData: CityData,
    private medicalCheckTypeData: MedicalCheckTypeData, private clinicData: ClinicData,
    private authService: AuthService) { }

  ngOnInit() {
    this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
    });
    this.initForm();
    this.getCountriesSelect();
  }

  ngOnDestroy() {
    this.currentUserIdSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getMedicalChecks() {
    const medicalCheckToAddQuery = {
      appointment: new Date(this.medicalCheckForm.value.appointment),
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
      appointment: new FormControl(new Date(), [Validators.required]),
      countryId: new FormControl('', [Validators.required]),
      countyId: new FormControl('', [Validators.required]),
      cityId: new FormControl('', [Validators.required]),
      clinicId: new FormControl('', [Validators.required]),
      medicalCheckTypeId: new FormControl('', [Validators.required]),
      employeeId: new FormControl('', [Validators.required])
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
    if (this.medicalCheckForm.value.clinicId !== '' && this.medicalCheckForm.value.medicalCheckTypeId !== '') {
      this.employeeData.GetEmployeesDropdown(+this.medicalCheckForm.value.clinicId,
        +this.medicalCheckForm.value.medicalCheckTypeId).subscribe((employees: SelectItemsList) => {
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
      appointment: new Date(this.medicalCheckForm.value.appointment),
      clinicId: +this.medicalCheckForm.value.clinicId,
      medicalCheckTypeId: +this.medicalCheckForm.value.medicalCheckTypeId,
      patientId: this.currentUserId
    } as AddMedicalCheckCommand;

    this.medicalCheckData.AddMedicalCheck(addMedicalCheckCommand).subscribe((res: Result) => {
      this.uiService.showSuccessSnackbar(res.successMessage, null, 3000);
      this._location.back();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.uiService.showErrorSnackbar(error, null, 3000);
    });
  }

  goBack() {
    this._location.back();
  }

}
