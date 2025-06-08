import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatSortHarness } from '@angular/material/sort/testing';

import { EmployeesComponent } from './employees.component';
import { EmployeeData, EmployeesList, EmployeeLookup } from 'src/app/@core/data/employee';
import { UIService } from 'src/app/shared/ui.service';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;
  let mockEmployeeData: jasmine.SpyObj<EmployeeData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let loader: HarnessLoader;

  // Mock data
  const mockEmployees: EmployeeLookup[] = [
    {
      id: 1,
      name: 'John Doe',
      cnp: '1234567890123',
      employeeTypeName: 'Doctor',
      medicalCheckTypeName: 'General',
      clinicName: 'Clinic 1',
      startHour: { hours: 8, minutes: 0, minutesSelectList: { selectItems: [] }, hoursSelectList: { selectItems: [] } },
      endHour: { hours: 16, minutes: 30, minutesSelectList: { selectItems: [] }, hoursSelectList: { selectItems: [] } },
      terminationDate: new Date('2026-01-01'),
      deleted: false
    },
    {
      id: 2,
      name: 'Jane Smith',
      cnp: '2345678901234',
      employeeTypeName: 'Nurse',
      medicalCheckTypeName: 'Specialist',
      clinicName: 'Clinic 2',
      startHour: { hours: 9, minutes: 15, minutesSelectList: { selectItems: [] }, hoursSelectList: { selectItems: [] } },
      endHour: { hours: 17, minutes: 45, minutesSelectList: { selectItems: [] }, hoursSelectList: { selectItems: [] } },
      terminationDate: undefined,
      deleted: true
    }
  ];

  beforeEach(async () => {
    mockEmployeeData = jasmine.createSpyObj('EmployeeData', ['GetEmployees']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Set up mock response
    mockEmployeeData.GetEmployees.and.returnValue(of({
      employees: mockEmployees,
      succeeded: true,
      errors: []
    } as EmployeesList));

    await TestBed.configureTestingModule({
      imports: [
        EmployeesComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: EmployeeData, useValue: mockEmployeeData },
        { provide: UIService, useValue: mockUIService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    expect(mockEmployeeData.GetEmployees).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockEmployees);
    expect(component.isLoading).toBeFalse();
  });

  it('should display employees in the table', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();

    expect(rows.length).toBe(2);

    const firstRowCells = await rows[0].getCells();
    const firstCellTexts = await Promise.all(firstRowCells.map(cell => cell.getText()));

    expect(firstCellTexts[0]).toBe('1');
    expect(firstCellTexts[1]).toBe('John Doe');
    expect(firstCellTexts[2]).toBe('1234567890123');
  });

  it('should handle error when loading employees', () => {
    mockEmployeeData.GetEmployees.and.returnValue(throwError(() => 'Error loading employees'));

    component.getEmployees();
    fixture.detectChanges();

    expect(mockUIService.showErrorSnackbar).toHaveBeenCalledWith('Error loading employees', undefined, 3000);
    expect(component.isLoading).toBeFalse();
    expect(component.dataSource.data).toEqual([]);
  });

  it('should filter employees when filter input changes', () => {
    // Apply filter
    const filterValue = 'John';
    const inputElement = fixture.debugElement.query(By.css('input[matInput]')).nativeElement;
    inputElement.value = filterValue;

    component.doFilter({ target: inputElement } as unknown as Event);
    fixture.detectChanges();

    expect(component.dataSource.filter).toBe('john');
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].name).toBe('John Doe');
  });

  it('should navigate to add employee page when button is clicked', () => {
    const addButton = fixture.debugElement.query(By.css('button[color="primary"]'));
    addButton.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees/employees/add']);
  });

  it('should format time correctly', () => {
    expect(component.formatTime(8, 0)).toBe('08:00');
    expect(component.formatTime(9, 5)).toBe('09:05');
    expect(component.formatTime(14, 30)).toBe('14:30');
  });
});