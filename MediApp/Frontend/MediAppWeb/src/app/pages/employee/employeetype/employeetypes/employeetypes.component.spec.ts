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

import { EmployeetypesComponent } from './employeetypes.component';
import { EmployeeTypeData, EmployeeTypesList, EmployeeTypeLookup } from 'src/app/@core/data/employeetype';
import { UIService } from 'src/app/shared/ui.service';

describe('EmployeetypesComponent', () => {
  let component: EmployeetypesComponent;
  let fixture: ComponentFixture<EmployeetypesComponent>;
  let mockEmployeeTypeData: jasmine.SpyObj<EmployeeTypeData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let loader: HarnessLoader;

  // Mock data
  const mockEmployeeTypes: EmployeeTypeLookup[] = [
    { id: 1, name: 'Employee Type 1', deleted: false },
    { id: 2, name: 'Employee Type 2', deleted: true },
    { id: 3, name: 'Employee Type 3', deleted: false }
  ];

  beforeEach(async () => {
    mockEmployeeTypeData = jasmine.createSpyObj('EmployeeTypeData', ['GetEmployeeTypes']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Set up mock response for GetEmployeeTypes
    mockEmployeeTypeData.GetEmployeeTypes.and.returnValue(of({
      employeeTypes: mockEmployeeTypes,
      succeeded: true,
      errors: []
    } as EmployeeTypesList));

    await TestBed.configureTestingModule({
      imports: [
        EmployeetypesComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: EmployeeTypeData, useValue: mockEmployeeTypeData },
        { provide: UIService, useValue: mockUIService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeetypesComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employee types on init', () => {
    expect(mockEmployeeTypeData.GetEmployeeTypes).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockEmployeeTypes);
    expect(component.isLoading).toBeFalse();
  });

  it('should display employee types in the table', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();

    expect(rows.length).toBe(3);

    const firstRowCells = await rows[0].getCells();
    const firstCellTexts = await Promise.all(firstRowCells.map(cell => cell.getText()));

    expect(firstCellTexts[0]).toBe('1');
    expect(firstCellTexts[1]).toBe('Employee Type 1');
  });

  it('should handle error when loading employee types', () => {
    // Reset and make GetEmployeeTypes return an error
    mockEmployeeTypeData.GetEmployeeTypes.and.returnValue(throwError(() => 'Error loading employee types'));

    component.getEmployeeTypes();
    fixture.detectChanges();

    expect(mockUIService.showErrorSnackbar).toHaveBeenCalledWith('Error loading employee types', undefined, 3000);
    expect(component.isLoading).toBeFalse();
    expect(component.dataSource.data).toEqual([]);
  });

  it('should filter employee types when filter input changes', () => {
    // Apply filter
    const filterValue = 'Type 1';
    const event = new KeyboardEvent('keyup', {});
    const inputElement = fixture.debugElement.query(By.css('input[matInput]')).nativeElement;
    inputElement.value = filterValue;

    component.doFilter({ target: inputElement } as unknown as Event);
    fixture.detectChanges();

    expect(component.dataSource.filter).toBe('type 1');

    // Check that the filter works
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].name).toBe('Employee Type 1');
  });

  it('should navigate to add employee type page when button is clicked', () => {
    const addButton = fixture.debugElement.query(By.css('button[color="primary"]'));
    addButton.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees/employeetypes/add']);
  });

  it('should initialize sort and paginator after view init', async () => {
    const sort = await loader.getHarness(MatSortHarness);
    const paginator = await loader.getHarness(MatPaginatorHarness);

    expect(sort).toBeTruthy();
    expect(paginator).toBeTruthy();
    expect(component.dataSource.sort).toBe(component.sort);
    expect(component.dataSource.paginator).toBe(component.paginator);
  });
});