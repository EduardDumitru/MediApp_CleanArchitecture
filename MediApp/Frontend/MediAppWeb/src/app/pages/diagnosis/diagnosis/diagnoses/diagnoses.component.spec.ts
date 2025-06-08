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

import { DiagnosesComponent } from './diagnoses.component';
import { DiagnosisData, DiagnosesList, DiagnosisLookup } from 'src/app/@core/data/diagnosis';
import { UIService } from 'src/app/shared/ui.service';

describe('DiagnosesComponent', () => {
  let component: DiagnosesComponent;
  let fixture: ComponentFixture<DiagnosesComponent>;
  let mockDiagnosisData: jasmine.SpyObj<DiagnosisData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let loader: HarnessLoader;

  // Mock data
  const mockDiagnoses: DiagnosisLookup[] = [
    { id: 1, name: 'Common Cold', deleted: false },
    { id: 2, name: 'Flu', deleted: true },
    { id: 3, name: 'Headache', deleted: false }
  ];

  beforeEach(async () => {
    mockDiagnosisData = jasmine.createSpyObj('DiagnosisData', ['GetDiagnoses']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Set up mock response for GetDiagnoses
    mockDiagnosisData.GetDiagnoses.and.returnValue(of({
      diagnoses: mockDiagnoses,
      succeeded: true,
      errors: []
    } as DiagnosesList));

    await TestBed.configureTestingModule({
      imports: [
        DiagnosesComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: DiagnosisData, useValue: mockDiagnosisData },
        { provide: UIService, useValue: mockUIService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosesComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load diagnoses on init', () => {
    expect(mockDiagnosisData.GetDiagnoses).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockDiagnoses);
    expect(component.isLoading).toBeFalse();
  });

  it('should display diagnoses in the table', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();

    expect(rows.length).toBe(3);

    const firstRowCells = await rows[0].getCells();
    const firstCellTexts = await Promise.all(firstRowCells.map(cell => cell.getText()));

    expect(firstCellTexts[0]).toBe('1');
    expect(firstCellTexts[1]).toBe('Common Cold');
  });

  it('should handle error when loading diagnoses', () => {
    mockDiagnosisData.GetDiagnoses.and.returnValue(throwError(() => 'Error loading diagnoses'));

    component.getDiagnoses();
    fixture.detectChanges();

    expect(mockUIService.showErrorSnackbar).toHaveBeenCalledWith('Error loading diagnoses', undefined, 3000);
    expect(component.isLoading).toBeFalse();
    expect(component.dataSource.data).toEqual([]);
  });

  it('should filter diagnoses when filter input changes', () => {
    // Apply filter
    const filterValue = 'Cold';
    const inputElement = fixture.debugElement.query(By.css('input[matInput]')).nativeElement;
    inputElement.value = filterValue;

    component.doFilter({ target: inputElement } as unknown as Event);
    fixture.detectChanges();

    expect(component.dataSource.filter).toBe('cold');
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].name).toBe('Common Cold');
  });

  it('should navigate to add diagnosis page when button is clicked', () => {
    const addButton = fixture.debugElement.query(By.css('button[color="primary"]'));
    addButton.triggerEventHandler('click', null);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/diagnoses/diagnoses/add']);
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