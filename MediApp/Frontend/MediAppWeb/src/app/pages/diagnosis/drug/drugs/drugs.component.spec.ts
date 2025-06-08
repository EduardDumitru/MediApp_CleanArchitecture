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

import { DrugsComponent } from './drugs.component';
import { DrugData, DrugsList, DrugLookup } from 'src/app/@core/data/drug';
import { UIService } from 'src/app/shared/ui.service';

describe('DrugsComponent', () => {
  let component: DrugsComponent;
  let fixture: ComponentFixture<DrugsComponent>;
  let mockDrugData: jasmine.SpyObj<DrugData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let loader: HarnessLoader;

  // Mock data
  const mockDrugs: DrugLookup[] = [
    { id: 1, name: 'Aspirin', deleted: false },
    { id: 2, name: 'Paracetamol', deleted: true },
    { id: 3, name: 'Ibuprofen', deleted: false }
  ];

  beforeEach(async () => {
    mockDrugData = jasmine.createSpyObj('DrugData', ['GetDrugs']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Set up mock response for GetDrugs
    mockDrugData.GetDrugs.and.returnValue(of({
      drugs: mockDrugs,
      succeeded: true,
      errors: []
    } as DrugsList));

    await TestBed.configureTestingModule({
      imports: [
        DrugsComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: DrugData, useValue: mockDrugData },
        { provide: UIService, useValue: mockUIService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrugsComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load drugs on init', () => {
    expect(mockDrugData.GetDrugs).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockDrugs);
    expect(component.isLoading).toBeFalse();
  });

  it('should display drugs in the table', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();

    expect(rows.length).toBe(3);

    const firstRowCells = await rows[0].getCells();
    const firstCellTexts = await Promise.all(firstRowCells.map(cell => cell.getText()));

    expect(firstCellTexts[0]).toBe('1');
    expect(firstCellTexts[1]).toBe('Aspirin');
  });

  it('should handle error when loading drugs', () => {
    mockDrugData.GetDrugs.and.returnValue(throwError(() => 'Error loading drugs'));

    component.getDrugs();
    fixture.detectChanges();

    expect(mockUIService.showErrorSnackbar).toHaveBeenCalledWith('Error loading drugs', undefined, 3000);
    expect(component.isLoading).toBeFalse();
    expect(component.dataSource.data).toEqual([]);
  });

  it('should filter drugs when filter input changes', () => {
    // Apply filter
    const filterValue = 'Aspirin';
    const inputElement = fixture.debugElement.query(By.css('input[matInput]')).nativeElement;
    inputElement.value = filterValue;

    component.doFilter({ target: inputElement } as unknown as Event);
    fixture.detectChanges();

    expect(component.dataSource.filter).toBe('aspirin');
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].name).toBe('Aspirin');
  });

  it('should navigate to add drug page when button is clicked', () => {
    const addButton = fixture.debugElement.query(By.css('button[color="primary"]'));
    addButton.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/diagnoses/drugs/add']);
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