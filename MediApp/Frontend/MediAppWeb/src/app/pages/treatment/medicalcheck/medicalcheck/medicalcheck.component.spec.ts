import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { of, Subject } from 'rxjs';

import { MedicalCheckComponent } from './medicalcheck.component';
import { MedicalCheckData } from 'src/app/@core/data/medicalcheck';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CountryData } from 'src/app/@core/data/country';
import { CountyData } from 'src/app/@core/data/county';
import { CityData } from 'src/app/@core/data/city';
import { ClinicData } from 'src/app/@core/data/clinic';
import { EmployeeData } from 'src/app/@core/data/employee';
import { MedicalCheckTypeData } from 'src/app/@core/data/medicalchecktype';
import { UserProfileData } from 'src/app/@core/data/userclasses/userprofile';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';

describe('MedicalCheckComponent', () => {
  let component: MedicalCheckComponent;
  let fixture: ComponentFixture<MedicalCheckComponent>;

  // Mock services
  let mockMedicalCheckData: jasmine.SpyObj<MedicalCheckData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockCountryData: jasmine.SpyObj<CountryData>;
  let mockCountyData: jasmine.SpyObj<CountyData>;
  let mockCityData: jasmine.SpyObj<CityData>;
  let mockClinicData: jasmine.SpyObj<ClinicData>;
  let mockEmployeeData: jasmine.SpyObj<EmployeeData>;
  let mockMedicalCheckTypeData: jasmine.SpyObj<MedicalCheckTypeData>;
  let mockUserProfileData: jasmine.SpyObj<UserProfileData>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  // Subjects for mock auth service
  const userIdSubject = new Subject<number>();
  const isAdminSubject = new Subject<boolean>();
  const isDoctorSubject = new Subject<boolean>();
  const isNurseSubject = new Subject<boolean>();

  beforeEach(waitForAsync(() => {
    // Create spy objects for all services
    mockMedicalCheckData = jasmine.createSpyObj('MedicalCheckData', [
      'GetMedicalChecksToAdd',
      'AddMedicalCheck'
    ]);
    mockUIService = jasmine.createSpyObj('UIService', [
      'showErrorSnackbar',
      'showSuccessSnackbar'
    ]);
    mockCountryData = jasmine.createSpyObj('CountryData', ['GetCountriesFromEmployeesDropdown']);
    mockCountyData = jasmine.createSpyObj('CountyData', ['GetCountiesByCountryFromEmployeesDropdown']);
    mockCityData = jasmine.createSpyObj('CityData', ['GetCitiesByCountyFromEmployeesDropdown']);
    mockClinicData = jasmine.createSpyObj('ClinicData', ['GetClinicsDropdown']);
    mockEmployeeData = jasmine.createSpyObj('EmployeeData', ['GetEmployeesDropdown']);
    mockMedicalCheckTypeData = jasmine.createSpyObj('MedicalCheckTypeData', ['GetMedicalCheckTypesByClinicDropdown']);
    mockUserProfileData = jasmine.createSpyObj('UserProfileData', ['getUserProfilesDropdown']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      currentUserId: userIdSubject.asObservable(),
      isAdmin: isAdminSubject.asObservable(),
      isDoctor: isDoctorSubject.asObservable(),
      isNurse: isNurseSubject.asObservable()
    });

    // Set up return values
    mockMedicalCheckData.GetMedicalChecksToAdd.and.returnValue(of({ medicalChecksToAdd: [] }));
    mockMedicalCheckData.AddMedicalCheck.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Success' }));
    mockCountryData.GetCountriesFromEmployeesDropdown.and.returnValue(of(new SelectItemsList()));
    mockCountyData.GetCountiesByCountryFromEmployeesDropdown.and.returnValue(of(new SelectItemsList()));
    mockCityData.GetCitiesByCountyFromEmployeesDropdown.and.returnValue(of(new SelectItemsList()));
    mockClinicData.GetClinicsDropdown.and.returnValue(of(new SelectItemsList()));
    mockEmployeeData.GetEmployeesDropdown.and.returnValue(of(new SelectItemsList()));
    mockMedicalCheckTypeData.GetMedicalCheckTypesByClinicDropdown.and.returnValue(of(new SelectItemsList()));
    mockUserProfileData.getUserProfilesDropdown.and.returnValue(of(new SelectItemsList()));

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [MedicalCheckComponent],
      providers: [
        { provide: MedicalCheckData, useValue: mockMedicalCheckData },
        { provide: UIService, useValue: mockUIService },
        { provide: CountryData, useValue: mockCountryData },
        { provide: CountyData, useValue: mockCountyData },
        { provide: CityData, useValue: mockCityData },
        { provide: ClinicData, useValue: mockClinicData },
        { provide: EmployeeData, useValue: mockEmployeeData },
        { provide: MedicalCheckTypeData, useValue: mockMedicalCheckTypeData },
        { provide: UserProfileData, useValue: mockUserProfileData },
        { provide: Location, useValue: mockLocation },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalCheckComponent);
    component = fixture.componentInstance;

    // Trigger the auth service subjects before component initialization
    userIdSubject.next(123);
    isAdminSubject.next(false);
    isDoctorSubject.next(false);
    isNurseSubject.next(false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.medicalCheckForm).toBeDefined();
    expect(component.medicalCheckForm.get('patientId')?.value).toBe('123');
  });

  it('should get countries on init', () => {
    expect(mockCountryData.GetCountriesFromEmployeesDropdown).toHaveBeenCalled();
  });

  it('should filter out weekends in date picker', () => {
    // Test Sunday (day 0)
    const sunday = new Date(2025, 5, 8); // June 8, 2025 is a Sunday
    expect(component.myFilter(sunday)).toBeFalse();

    // Test Wednesday (day 3)
    const wednesday = new Date(2025, 5, 11); // June 11, 2025 is a Wednesday
    expect(component.myFilter(wednesday)).toBeTrue();

    // Test Saturday (day 6)
    const saturday = new Date(2025, 5, 14); // June 14, 2025 is a Saturday
    expect(component.myFilter(saturday)).toBeFalse();
  });

  it('should show user select dropdown for admin users', () => {
    // Arrange
    mockUserProfileData.getUserProfilesDropdown.calls.reset();
    isAdminSubject.next(true);

    // Act
    fixture.detectChanges();

    // Assert
    expect(mockUserProfileData.getUserProfilesDropdown).toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    // Act
    component.goBack();

    // Assert
    expect(mockLocation.back).toHaveBeenCalled();
  });
});