import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

import { HolidayintervalComponent } from './holidayinterval.component';
import { HolidayIntervalData } from 'src/app/@core/data/holidayinterval';
import { EmployeeData } from 'src/app/@core/data/employee';
import { AuthService } from 'src/app/auth/auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';

describe('HolidayintervalComponent', () => {
  let component: HolidayintervalComponent;
  let fixture: ComponentFixture<HolidayintervalComponent>;
  let mockHolidayIntervalData: jasmine.SpyObj<HolidayIntervalData>;
  let mockEmployeeData: jasmine.SpyObj<EmployeeData>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockLocation: jasmine.SpyObj<Location>;

  // Mock subjects
  let userIdSubject: BehaviorSubject<number>;
  let isAdminSubject: BehaviorSubject<boolean>;

  // Mock employee select list
  const mockEmployeeSelectList = new SelectItemsList();
  mockEmployeeSelectList.selectItems = [
    { value: '1', label: 'Employee 1' },
    { value: '2', label: 'Employee 2' }
  ];

  beforeEach(async () => {
    // Create mocks
    mockHolidayIntervalData = jasmine.createSpyObj('HolidayIntervalData', [
      'GetHolidayIntervalDetails',
      'AddHolidayInterval',
      'UpdateHolidayInterval',
      'DeleteHolidayInterval',
      'RestoreHolidayInterval'
    ]);

    mockEmployeeData = jasmine.createSpyObj('EmployeeData', [
      'GetEmployeeDetailsByCurrentUser',
      'GetAllEmployeesDropdown'
    ]);

    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    // Mock auth service
    userIdSubject = new BehaviorSubject<number>(1);
    isAdminSubject = new BehaviorSubject<boolean>(false);

    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      currentUserId: userIdSubject.asObservable(),
      isAdmin: isAdminSubject.asObservable()
    });

    // Setup default return values
    mockEmployeeData.GetAllEmployeesDropdown.and.returnValue(of(mockEmployeeSelectList));
    // Create SelectItemsList objects for hours and minutes
    const minutesSelectList = new SelectItemsList();
    minutesSelectList.selectItems = [
      { value: '0', label: '00' },
      { value: '15', label: '15' },
      { value: '30', label: '30' },
      { value: '45', label: '45' }
    ];

    const hoursSelectList = new SelectItemsList();
    hoursSelectList.selectItems = [
      { value: '8', label: '08:00' },
      { value: '9', label: '09:00' },
      { value: '10', label: '10:00' },
      { value: '11', label: '11:00' },
      { value: '12', label: '12:00' },
      { value: '13', label: '13:00' },
      { value: '14', label: '14:00' },
      { value: '15', label: '15:00' },
      { value: '16', label: '16:00' }
    ];

    mockEmployeeData.GetEmployeeDetailsByCurrentUser.and.returnValue(of({
      id: 1,
      userProfileId: 1,
      firstName: 'Test',
      lastName: 'User',
      name: 'Test User',
      cnp: '1234567890123',
      startHour: {
        hours: 8,
        minutes: 0,
        seconds: 0,
        totalHours: 8,
        totalMinutes: 480,
        totalSeconds: 28800,
        minutesSelectList: minutesSelectList,
        hoursSelectList: hoursSelectList
      },
      endHour: {
        hours: 16,
        minutes: 0,
        seconds: 0,
        totalHours: 16,
        totalMinutes: 960,
        totalSeconds: 57600,
        minutesSelectList: minutesSelectList,
        hoursSelectList: hoursSelectList
      },
      clinicId: 1,
      clinicName: 'Test Clinic',
      medicalCheckTypeId: 1,
      medicalCheckTypeName: 'General',
      employeeTypeId: 1,
      deleted: false
    }));

    await TestBed.configureTestingModule({
      imports: [
        HolidayintervalComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: HolidayIntervalData, useValue: mockHolidayIntervalData },
        { provide: EmployeeData, useValue: mockEmployeeData },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UIService, useValue: mockUIService },
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

    fixture = TestBed.createComponent(HolidayintervalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the holiday interval form', () => {
    expect(component.holidayIntervalForm).toBeDefined();
    expect(component.holidayIntervalForm.get('employeeId')).toBeDefined();
    expect(component.holidayIntervalForm.get('startDate')).toBeDefined();
    expect(component.holidayIntervalForm.get('endDate')).toBeDefined();
  });

  it('should load employee dropdown data', () => {
    expect(mockEmployeeData.GetAllEmployeesDropdown).toHaveBeenCalled();
    expect(component.employeeSelectList.selectItems?.length).toBe(2);
  });

  it('should auto-select current user employee when not admin', () => {
    // Non-admin user should have employee pre-selected and disabled
    expect(mockEmployeeData.GetEmployeeDetailsByCurrentUser).toHaveBeenCalled();
    expect(component.employeeId).toBe('1');
    expect(component.holidayIntervalForm.get('employeeId')?.disabled).toBe(true);
  });

  it('should filter out weekends from date selection', () => {
    // Test Saturday (day 6)
    const saturday = new Date('2025-06-07'); // This is a Saturday
    expect(component.myFilter(saturday)).toBe(false);

    // Test Sunday (day 0)
    const sunday = new Date('2025-06-08'); // This is a Sunday
    expect(component.myFilter(sunday)).toBe(false);

    // Test Monday (day 1)
    const monday = new Date('2025-06-09'); // This is a Monday
    expect(component.myFilter(monday)).toBe(true);
  });

  it('should call goBack when back button is clicked', () => {
    const backButton = fixture.debugElement.query(By.css('button[color="accent"]'));
    backButton.triggerEventHandler('click', null);

    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should determine if current user is the owner', () => {
    // Both IDs match, should return true
    component.currentUserId = 1;
    component.currentEmployeeUserId = 1;
    expect(component.isCurrentUserOwner()).toBe(true);

    // IDs don't match, should return false
    component.currentUserId = 1;
    component.currentEmployeeUserId = 2;
    expect(component.isCurrentUserOwner()).toBe(false);
  });

  it('should add holiday interval when form is submitted (no ID)', () => {
    mockHolidayIntervalData.AddHolidayInterval.and.returnValue(of({
      succeeded: true,
      errors: [],
      successMessage: 'Holiday interval added successfully'
    }));

    // Set valid form values
    const startDate = new Date('2025-06-09'); // Monday
    const endDate = new Date('2025-06-13'); // Friday

    component.holidayIntervalForm.patchValue({ employeeId: '1' });
    component.holidayIntervalForm.get('startDate')?.setValue(startDate);
    component.holidayIntervalForm.get('endDate')?.setValue(endDate);

    component.onSubmit();

    expect(mockHolidayIntervalData.AddHolidayInterval).toHaveBeenCalledWith({
      employeeId: 1,
      startDate: jasmine.any(Date),
      endDate: jasmine.any(Date)
    });
    expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Holiday interval added successfully', undefined, 3000);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  describe('when editing an existing holiday interval', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();

      mockHolidayIntervalData = jasmine.createSpyObj('HolidayIntervalData', [
        'GetHolidayIntervalDetails',
        'AddHolidayInterval',
        'UpdateHolidayInterval',
        'DeleteHolidayInterval',
        'RestoreHolidayInterval'
      ]);

      mockEmployeeData = jasmine.createSpyObj('EmployeeData', [
        'GetEmployeeDetailsByCurrentUser',
        'GetAllEmployeesDropdown'
      ]);

      mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
      mockLocation = jasmine.createSpyObj('Location', ['back']);

      // Mock auth service
      userIdSubject = new BehaviorSubject<number>(1);
      isAdminSubject = new BehaviorSubject<boolean>(false);

      mockAuthService = jasmine.createSpyObj('AuthService', [], {
        currentUserId: userIdSubject.asObservable(),
        isAdmin: isAdminSubject.asObservable()
      });

      // Setup default return values
      mockEmployeeData.GetAllEmployeesDropdown.and.returnValue(of(mockEmployeeSelectList));

      mockHolidayIntervalData.GetHolidayIntervalDetails.and.returnValue(of({
        id: 1,
        employeeId: 1,
        employeeName: 'Employee 1',
        startDate: new Date('2025-06-09'),
        endDate: new Date('2025-06-13'),
        userProfileId: 1,
        deleted: false
      }));

      TestBed.configureTestingModule({
        imports: [
          HolidayintervalComponent,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: HolidayIntervalData, useValue: mockHolidayIntervalData },
          { provide: EmployeeData, useValue: mockEmployeeData },
          { provide: AuthService, useValue: mockAuthService },
          { provide: UIService, useValue: mockUIService },
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

      fixture = TestBed.createComponent(HolidayintervalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should load holiday interval details', () => {
      expect(mockHolidayIntervalData.GetHolidayIntervalDetails).toHaveBeenCalledWith(1);
      expect(component.holidayIntervalId).toBe(1);
      expect(component.employeeId).toBe('1');
    });

    it('should update holiday interval when form is submitted', () => {
      mockHolidayIntervalData.UpdateHolidayInterval.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Holiday interval updated successfully'
      }));

      // Values are pre-filled from GetHolidayIntervalDetails
      component.onSubmit();

      expect(mockHolidayIntervalData.UpdateHolidayInterval).toHaveBeenCalledWith({
        id: 1,
        employeeId: 1,
        startDate: jasmine.any(Date),
        endDate: jasmine.any(Date)
      });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Holiday interval updated successfully', undefined, 3000);
    });

    it('should delete holiday interval when delete button is clicked', () => {
      mockHolidayIntervalData.DeleteHolidayInterval.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Holiday interval deleted successfully'
      }));

      component.deleteHolidayInterval();

      expect(mockHolidayIntervalData.DeleteHolidayInterval).toHaveBeenCalledWith(1);
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Holiday interval deleted successfully', undefined, 3000);
    });
  });
});