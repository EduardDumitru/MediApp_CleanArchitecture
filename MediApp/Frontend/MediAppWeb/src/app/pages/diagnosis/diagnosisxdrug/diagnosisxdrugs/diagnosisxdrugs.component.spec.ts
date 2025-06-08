import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { DiagnosisxDrugsComponent } from './diagnosisxdrugs.component';
import { DiagnosisXDrugData, DiagnosisXDrugsList, DiagnosisXDrugsLookup } from 'src/app/@core/data/diagnosisxdrug';
import { UIService } from 'src/app/shared/ui.service';

describe('DiagnosisxDrugsComponent', () => {
  let component: DiagnosisxDrugsComponent;
  let fixture: ComponentFixture<DiagnosisxDrugsComponent>;
  let mockDiagnosisXDrugData: jasmine.SpyObj<DiagnosisXDrugData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let loader: HarnessLoader;

  // Mock data
  const mockDiagnosisXDrugs: DiagnosisXDrugsLookup[] = [
    { id: 1, diagnosisName: 'Common Cold', drugName: 'Aspirin', deleted: false },
    { id: 2, diagnosisName: 'Flu', drugName: 'Paracetamol', deleted: true },
    { id: 3, diagnosisName: 'Headache', drugName: 'Ibuprofen', deleted: false }
  ];

  beforeEach(async () => {
    mockDiagnosisXDrugData = jasmine.createSpyObj('DiagnosisXDrugData', [
      'GetDiagnosisXDrugs',
      'DeleteDiagnosisXDrug',
      'RestoreDiagnosisXDrug'
    ]);

    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Set up mock responses
    mockDiagnosisXDrugData.GetDiagnosisXDrugs.and.returnValue(of({
      diagnosisXDrugs: mockDiagnosisXDrugs,
      succeeded: true,
      errors: []
    } as DiagnosisXDrugsList));

    await TestBed.configureTestingModule({
      imports: [
        DiagnosisxDrugsComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: DiagnosisXDrugData, useValue: mockDiagnosisXDrugData },
        { provide: UIService, useValue: mockUIService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosisxDrugsComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load diagnosis-drug relations on init', () => {
    expect(mockDiagnosisXDrugData.GetDiagnosisXDrugs).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockDiagnosisXDrugs);
    expect(component.isLoading).toBeFalse();
  });

  it('should display diagnosis-drug relations in the table', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();

    expect(rows.length).toBe(3);

    const firstRowCells = await rows[0].getCells();
    const firstCellTexts = await Promise.all(firstRowCells.map(cell => cell.getText()));

    expect(firstCellTexts[0]).toBe('1');
    expect(firstCellTexts[1]).toBe('Common Cold');
    expect(firstCellTexts[2]).toBe('Aspirin');
  });

  it('should handle error when loading diagnosis-drug relations', () => {
    mockDiagnosisXDrugData.GetDiagnosisXDrugs.and.returnValue(
      throwError(() => 'Error loading diagnosis-drug relations')
    );

    component.getDiagnosisXDrugs();
    fixture.detectChanges();

    expect(mockUIService.showErrorSnackbar).toHaveBeenCalledWith(
      'Error loading diagnosis-drug relations',
      undefined,
      3000
    );
    expect(component.isLoading).toBeFalse();
    expect(component.dataSource.data).toEqual([]);
  });

  it('should filter diagnosis-drug relations', () => {
    // Apply filter
    const filterValue = 'Cold';
    const inputElement = fixture.debugElement.query(By.css('input[matInput]')).nativeElement;
    inputElement.value = filterValue;

    component.doFilter({ target: inputElement } as unknown as Event);
    fixture.detectChanges();

    expect(component.dataSource.filter).toBe('cold');
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].diagnosisName).toBe('Common Cold');
  });

  it('should delete diagnosis-drug relation', () => {
    mockDiagnosisXDrugData.DeleteDiagnosisXDrug.and.returnValue(of({
      succeeded: true,
      errors: [],
      successMessage: 'Diagnosis-drug relation deleted successfully'
    }));

    spyOn(component, 'getDiagnosisXDrugs');
    component.deleteDiagnosisXDrug(1);

    expect(mockDiagnosisXDrugData.DeleteDiagnosisXDrug).toHaveBeenCalledWith(1);
    expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith(
      'Diagnosis-drug relation deleted successfully',
      undefined,
      3000
    );
    expect(component.getDiagnosisXDrugs).toHaveBeenCalled();
  });

  it('should restore diagnosis-drug relation', () => {
    mockDiagnosisXDrugData.RestoreDiagnosisXDrug.and.returnValue(of({
      succeeded: true,
      errors: [],
      successMessage: 'Diagnosis-drug relation restored successfully'
    }));

    spyOn(component, 'getDiagnosisXDrugs');
    component.restoreDiagnosisXDrug(2);

    expect(mockDiagnosisXDrugData.RestoreDiagnosisXDrug).toHaveBeenCalledWith({ id: 2 });
    expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith(
      'Diagnosis-drug relation restored successfully',
      undefined,
      3000
    );
    expect(component.getDiagnosisXDrugs).toHaveBeenCalled();
  });

  it('should navigate to add diagnosis-drug relation page', async () => {
    const addButton = await loader.getHarness(MatButtonHarness.with({ text: /Add Diagnosis-Drug Relation/ }));
    await addButton.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/diagnoses/diagnosisxdrugs/add']);
  });
});