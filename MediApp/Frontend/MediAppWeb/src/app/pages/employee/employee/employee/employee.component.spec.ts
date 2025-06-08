import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { EmployeeComponent } from './employee.component';
import { EmployeeData } from 'src/app/@core/data/employee';
import { UIService } from 'src/app/shared/ui.service';
import { EmployeeTypeData } from 'src/app/@core/data/employeetype';
import { MedicalCheckTypeData } from 'src/app/@core/data/medicalchecktype';
import { ClinicData } from 'src/app/@core/data/clinic';
import { UserProfileData } from 'src/app/@core/data/userclasses/userprofile';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { TimeSpan } from 'src/app/@core/data/common/timespan';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let mockEmployeeData: jasmine.SpyObj<EmployeeData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockEmployeeTypeData: jasmine.SpyObj<EmployeeTypeData>;
  let mockMedicalCheckTypeData: jasmine.SpyObj<MedicalCheckTypeData>;
  let mockClinicData: jasmine.SpyObj<ClinicData>;
  let mockUserProfileData: jasmine.SpyObj<UserProfileData>;
  let mockLocation: jasmine.SpyObj<Location>;

  // Mock data
  const mockEmployeeTypes = new SelectItemsList();
  mockEmployeeTypes.selectItems = [
    { value: '1', label: 'Nurse' },
    { value: '2', label: 'Doctor' }
  ];

  const mockClinicList = new SelectItemsList();
  mockClinicList.selectItems = [
    { value: '1', label: 'Clinic 1' },
    { value: '2', label: 'Clinic 2' }
  ];

  const mockUserProfiles = new SelectItemsList();
  mockUserProfiles.selectItems = [
    { value: '1', label: 'User 1' },
    { value: '2', label: 'User 2' }
  ];

  const mockMedicalCheckTypes = new SelectItemsList();
  mockMedicalCheckTypes.selectItems = [
    { value: '1', label: 'General' },
    { value: '2', label: 'Specialist' }
  ];

  const mockTimeSpan = new TimeSpan(0, 0);

  beforeEach(async () => {
    // Create mocks
    mockEmployeeData = jasmine.createSpyObj('EmployeeData', [
      'GetEmployeeDetails',
      'AddEmployee',
      'UpdateEmployee',
      'DeleteEmployee',
      'RestoreEmployee'
    ]);

    mockUIService = jasmine.createSpyObj('UIService', [
      'showErrorSnackbar',
      'showSuccessSnackbar'
    ]);

    mockEmployeeTypeData = jasmine.createSpyObj('EmployeeTypeData', [
      'GetEmployeeTypesDropdown'
    ]);

    mockMedicalCheckTypeData = jasmine.createSpyObj('MedicalCheckTypeData', [
      'GetMedicalCheckTypesDropdown'
    ]);

    mockClinicData = jasmine.createSpyObj('ClinicData', [
      'GetClinicsDropdown'
    ]);

    mockUserProfileData = jasmine.createSpyObj('UserProfileData', [
      'getUserProfilesDropdown'
    ]);

    mockLocation = jasmine.createSpyObj('Location', ['back']);

    // Setup default return values
    mockEmployeeTypeData.GetEmployeeTypesDropdown.and.returnValue(of(mockEmployeeTypes));
    mockClinicData.GetClinicsDropdown.and.returnValue(of(mockClinicList));
    mockUserProfileData.getUserProfilesDropdown.and.returnValue(of(mockUserProfiles));
    mockMedicalCheckTypeData.GetMedicalCheckTypesDropdown.and.returnValue(of(mockMedicalCheckTypes));

    await TestBed.configureTestingModule({
      imports: [
        EmployeeComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: EmployeeData, useValue: mockEmployeeData },
        { provide: UIService, useValue: mockUIService },
        { provide: EmployeeTypeData, useValue: mockEmployeeTypeData },
        { provide: MedicalCheckTypeData, useValue: mockMedicalCheckTypeData },
        { provide: ClinicData, useValue: mockClinicData },
        { provide: UserProfileData, useValue: mockUserProfileData },
        { provide: Location, useValue: mockLocation },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {}
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the employee form', () => {
    expect(component.employeeForm).toBeDefined();
    expect(component.employeeForm.get('employeeTypeId')).toBeDefined();
    expect(component.employeeForm.get('clinicId')).toBeDefined();
  });

  it('should load clinic dropdown data', () => {
    expect(mockClinicData.GetClinicsDropdown).toHaveBeenCalled();
    expect(component.clinicSelectList).toEqual(mockClinicList);
  });

  it('should load user profiles dropdown when in add mode', () => {
    expect(mockUserProfileData.getUserProfilesDropdown).toHaveBeenCalled();
    expect(component.userProfileSelectList).toEqual(mockUserProfiles);
  });

  it('should call goBack when back button is clicked', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should update medicalCheckType validators when employee type changes to Doctor', () => {
    component.employeeTypeChange('2');

    expect(mockMedicalCheckTypeData.GetMedicalCheckTypesDropdown).toHaveBeenCalled();
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();

    expect(mockEmployeeData.AddEmployee).not.toHaveBeenCalled();
    expect(mockEmployeeData.UpdateEmployee).not.toHaveBeenCalled();
  });

  describe('when editing an existing employee', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();

      mockEmployeeData = jasmine.createSpyObj('EmployeeData', [
        'GetEmployeeDetails',
        'AddEmployee',
        'UpdateEmployee',
        'DeleteEmployee',
        'RestoreEmployee'
      ]);

      mockEmployeeData.GetEmployeeDetails.and.returnValue(of({
        id: 1,
        name: 'Test Employee',
        cnp: '1234567890123',
        employeeTypeId: 2,
        medicalCheckTypeId: 1,
        clinicId: 1,
        userProfileId: 1, // Added the missing required property
        startHour: {
          hours: 8,
          minutes: 0,
          minutesSelectList: mockTimeSpan.minutesSelectList,
          hoursSelectList: mockTimeSpan.hoursSelectList
        },
        endHour: {
          hours: 16,
          minutes: 0,
          minutesSelectList: mockTimeSpan.minutesSelectList,
          hoursSelectList: mockTimeSpan.hoursSelectList
        },
        terminationDate: undefined,
        deleted: false
      }));

      mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
      mockEmployeeTypeData = jasmine.createSpyObj('EmployeeTypeData', ['GetEmployeeTypesDropdown']);
      mockMedicalCheckTypeData = jasmine.createSpyObj('MedicalCheckTypeData', ['GetMedicalCheckTypesDropdown']);
      mockClinicData = jasmine.createSpyObj('ClinicData', ['GetClinicsDropdown']);
      mockUserProfileData = jasmine.createSpyObj('UserProfileData', ['getUserProfilesDropdown']);
      mockLocation = jasmine.createSpyObj('Location', ['back']);

      mockEmployeeTypeData.GetEmployeeTypesDropdown.and.returnValue(of(mockEmployeeTypes));
      mockClinicData.GetClinicsDropdown.and.returnValue(of(mockClinicList));
      mockMedicalCheckTypeData.GetMedicalCheckTypesDropdown.and.returnValue(of(mockMedicalCheckTypes));

      TestBed.configureTestingModule({
        imports: [
          EmployeeComponent,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: EmployeeData, useValue: mockEmployeeData },
          { provide: UIService, useValue: mockUIService },
          { provide: EmployeeTypeData, useValue: mockEmployeeTypeData },
          { provide: MedicalCheckTypeData, useValue: mockMedicalCheckTypeData },
          { provide: ClinicData, useValue: mockClinicData },
          { provide: UserProfileData, useValue: mockUserProfileData },
          { provide: Location, useValue: mockLocation },
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                params: { id: '1' }
              }
            }
          }
        ]
      });

      fixture = TestBed.createComponent(EmployeeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should load employee details', () => {
      expect(mockEmployeeData.GetEmployeeDetails).toHaveBeenCalledWith(1);
      expect(component.employeeId).toBe(1);
    });

    it('should populate the form with employee details', () => {
      expect(component.employeeForm.get('name')?.value).toBe('Test Employee');
      expect(component.employeeForm.get('cnp')?.value).toBe('1234567890123');
      expect(component.employeeForm.get('employeeTypeId')?.value).toBe('2');
    });

    it('should load medical check types for doctor employee type', () => {
      expect(mockMedicalCheckTypeData.GetMedicalCheckTypesDropdown).toHaveBeenCalled();
    });

    it('should update employee when form is submitted', () => {
      mockEmployeeData.UpdateEmployee.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Employee updated successfully'
      }));

      component.employeeForm.patchValue({
        employeeTypeId: '2',
        medicalCheckTypeId: '1',
        clinicId: '1',
        startHour: '8',
        startMinutes: '0',
        endHour: '16',
        endMinutes: '0'
      });

      component.onSubmit();

      expect(mockEmployeeData.UpdateEmployee).toHaveBeenCalled();
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalled();
    });

    it('should delete employee', () => {
      mockEmployeeData.DeleteEmployee.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Employee deleted successfully'
      }));

      component.deleteEmployee();

      expect(mockEmployeeData.DeleteEmployee).toHaveBeenCalledWith(1);
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalled();
    });
  });
});