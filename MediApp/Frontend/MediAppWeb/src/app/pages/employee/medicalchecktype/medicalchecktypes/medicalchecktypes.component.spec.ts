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

import { MedicalchecktypesComponent } from './medicalchecktypes.component';
import { MedicalCheckTypeData, MedicalCheckTypesList, MedicalCheckTypeLookup } from 'src/app/@core/data/medicalchecktype';
import { UIService } from 'src/app/shared/ui.service';

describe('MedicalchecktypesComponent', () => {
  let component: MedicalchecktypesComponent;
  let fixture: ComponentFixture<MedicalchecktypesComponent>;
  let mockMedicalCheckTypeData: jasmine.SpyObj<MedicalCheckTypeData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let loader: HarnessLoader;

  // Mock data
  const mockMedicalCheckTypes: MedicalCheckTypeLookup[] = [
    { id: 1, name: 'Medical Check Type 1', deleted: false },
    { id: 2, name: 'Medical Check Type 2', deleted: true },
    { id: 3, name: 'Medical Check Type 3', deleted: false }
  ];

  beforeEach(async () => {
    mockMedicalCheckTypeData = jasmine.createSpyObj('MedicalCheckTypeData', ['GetMedicalCheckTypes']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Set up mock response for GetMedicalCheckTypes
    mockMedicalCheckTypeData.GetMedicalCheckTypes.and.returnValue(of({
      medicalCheckTypes: mockMedicalCheckTypes,
      succeeded: true,
      errors: []
    } as MedicalCheckTypesList));

    await TestBed.configureTestingModule({
      imports: [
        MedicalchecktypesComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MedicalCheckTypeData, useValue: mockMedicalCheckTypeData },
        { provide: UIService, useValue: mockUIService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalchecktypesComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medical check types on init', () => {
    expect(mockMedicalCheckTypeData.GetMedicalCheckTypes).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockMedicalCheckTypes);
    expect(component.isLoading).toBeFalse();
  });

  it('should display medical check types in the table', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();

    expect(rows.length).toBe(3);

    const firstRowCells = await rows[0].getCells();
    const firstCellTexts = await Promise.all(firstRowCells.map(cell => cell.getText()));

    expect(firstCellTexts[0]).toBe('1');
    expect(firstCellTexts[1]).toBe('Medical Check Type 1');
  });

  it('should handle error when loading medical check types', () => {
    // Reset and make GetMedicalCheckTypes return an error
    mockMedicalCheckTypeData.GetMedicalCheckTypes.and.returnValue(throwError(() => 'Error loading medical check types'));

    component.getMedicalCheckTypes();
    fixture.detectChanges();

    expect(mockUIService.showErrorSnackbar).toHaveBeenCalledWith('Error loading medical check types', undefined, 3000);
    expect(component.isLoading).toBeFalse();
    expect(component.dataSource.data).toEqual([]);
  });

  it('should filter medical check types when filter input changes', () => {
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
    expect(component.dataSource.filteredData[0].name).toBe('Medical Check Type 1');
  });

  it('should navigate to add medical check type page when button is clicked', () => {
    const addButton = fixture.debugElement.query(By.css('button[color="primary"]'));
    addButton.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees/medicalchecktypes/add']);
  });

  it('should initialize sort and paginator after view init', async () => {
    const sort = await loader.getHarness(MatSortHarness);
    const paginator = await loader.getHarness(MatPaginatorHarness);

    expect(sort).toBeTruthy();
    expect(paginator).toBeTruthy();
    expect(component.dataSource.sort).toBe(component.sort);
    expect(component.dataSource.paginator).toBe(component.paginator);
  });

  it('should show spinner when loading', () => {
    // Set loading state
    component.isLoading = true;
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();

    // Reset loading state
    component.isLoading = false;
    fixture.detectChanges();

    const spinnerAfter = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinnerAfter).toBeFalsy();
  });
});