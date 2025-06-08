import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatSortHarness } from '@angular/material/sort/testing';

import { HolidayintervalsComponent } from './holidayintervals.component';
import { HolidayIntervalData, HolidayIntervalsList, HolidayIntervalLookup } from 'src/app/@core/data/holidayinterval';
import { AuthService } from 'src/app/auth/auth.service';
import { UIService } from 'src/app/shared/ui.service';

describe('HolidayintervalsComponent', () => {
  let component: HolidayintervalsComponent;
  let fixture: ComponentFixture<HolidayintervalsComponent>;
  let mockHolidayIntervalData: jasmine.SpyObj<HolidayIntervalData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let loader: HarnessLoader;

  // Mock subjects for auth service
  let mockClinicIdSubject: BehaviorSubject<number>;
  let mockIsAdminSubject: BehaviorSubject<boolean>;

  // Mock data
  const mockHolidayIntervals: HolidayIntervalLookup[] = [
    {
      id: 1,
      clinicName: 'Clinic 1',
      employeeName: 'Employee 1',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-07'),
      deleted: false
    },
    {
      id: 2,
      clinicName: 'Clinic 2',
      employeeName: 'Employee 2',
      startDate: new Date('2025-06-08'),
      endDate: new Date('2025-06-14'),
      deleted: true
    }
  ];

  beforeEach(async () => {
    mockHolidayIntervalData = jasmine.createSpyObj('HolidayIntervalData', [
      'GetHolidayIntervals',
      'GetHolidayIntervalsByClinic'
    ]);

    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Setup auth service mocks
    mockClinicIdSubject = new BehaviorSubject<number>(null as any);
    mockIsAdminSubject = new BehaviorSubject<boolean>(false);
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      clinicId: mockClinicIdSubject,
      isAdmin: mockIsAdminSubject
    });

    // Set up mock responses
    mockHolidayIntervalData.GetHolidayIntervals.and.returnValue(of({
      holidayIntervals: mockHolidayIntervals,
      succeeded: true,
      errors: []
    } as HolidayIntervalsList));

    mockHolidayIntervalData.GetHolidayIntervalsByClinic.and.returnValue(of({
      holidayIntervals: [mockHolidayIntervals[0]],
      succeeded: true,
      errors: []
    } as HolidayIntervalsList));

    await TestBed.configureTestingModule({
      imports: [
        HolidayintervalsComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: HolidayIntervalData, useValue: mockHolidayIntervalData },
        { provide: UIService, useValue: mockUIService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HolidayintervalsComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all holiday intervals when no clinic ID is set', () => {
    // Wait for async operations
    fixture.whenStable().then(() => {
      expect(mockHolidayIntervalData.GetHolidayIntervals).toHaveBeenCalled();
      expect(mockHolidayIntervalData.GetHolidayIntervalsByClinic).not.toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(mockHolidayIntervals);
    });
  });

  it('should load clinic-specific holiday intervals when clinic ID is set', () => {
    // Set clinic ID
    mockClinicIdSubject.next(1);
    component.clinicId = 1;

    // Manually trigger method since we're testing outside of ngAfterViewInit
    component.getHolidayIntervalsByClinicId();
    fixture.detectChanges();

    expect(mockHolidayIntervalData.GetHolidayIntervalsByClinic).toHaveBeenCalledWith(1);
    expect(component.dataSource.data).toEqual([mockHolidayIntervals[0]]);
  });

  it('should display holiday intervals in the table', async () => {
    // Wait for the data to load
    await fixture.whenStable();
    fixture.detectChanges();

    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();

    expect(rows.length).toBeGreaterThan(0);
  });

  it('should handle error when loading holiday intervals', () => {
    // Reset and make GetHolidayIntervals return an error
    mockHolidayIntervalData.GetHolidayIntervals.and.returnValue(throwError(() => 'Error loading holiday intervals'));

    component.getHolidayIntervals();
    fixture.detectChanges();

    expect(mockUIService.showErrorSnackbar).toHaveBeenCalledWith('Error loading holiday intervals', undefined, 3000);
    expect(component.isLoading).toBeFalse();
  });

  it('should filter holiday intervals when filter input changes', () => {
    // First set data
    component.dataSource.data = mockHolidayIntervals;

    // Apply filter
    const filterValue = 'Clinic 1';
    const inputElement = fixture.debugElement.query(By.css('input[matInput]')).nativeElement;
    inputElement.value = filterValue;

    component.doFilter({ target: inputElement } as unknown as Event);
    fixture.detectChanges();

    expect(component.dataSource.filter).toBe('clinic 1');
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].clinicName).toBe('Clinic 1');
  });

  it('should navigate to add holiday interval page when button is clicked', () => {
    const addButton = fixture.debugElement.query(By.css('button[color="primary"]'));
    addButton.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees/holidayintervals/add']);
  });

  it('should clean up subscriptions when component is destroyed', () => {
    const clinicSubscriptionSpy = spyOn(component.clinicSubscription, 'unsubscribe');
    const adminSubscriptionSpy = spyOn(component.adminSubscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(clinicSubscriptionSpy).toHaveBeenCalled();
    expect(adminSubscriptionSpy).toHaveBeenCalled();
  });
});