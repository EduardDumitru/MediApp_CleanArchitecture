import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

import { DiagnosisXDrugComponent } from './diagnosisxdrug.component';
import { DiagnosisXDrugData } from 'src/app/@core/data/diagnosisxdrug';
import { UIService } from 'src/app/shared/ui.service';
import { DiagnosisData } from 'src/app/@core/data/diagnosis';
import { DrugData } from 'src/app/@core/data/drug';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';

describe('DiagnosisXDrugComponent', () => {
  let component: DiagnosisXDrugComponent;
  let fixture: ComponentFixture<DiagnosisXDrugComponent>;
  let mockDiagnosisXDrugData: jasmine.SpyObj<DiagnosisXDrugData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockDiagnosisData: jasmine.SpyObj<DiagnosisData>;
  let mockDrugData: jasmine.SpyObj<DrugData>;
  let mockLocation: jasmine.SpyObj<Location>;
  let loader: HarnessLoader;

  // Mock data
  const mockDiagnosesList = new SelectItemsList();
  mockDiagnosesList.selectItems = [
    { value: '1', label: 'Common Cold' },
    { value: '2', label: 'Headache' }
  ];

  const mockDrugsList = new SelectItemsList();
  mockDrugsList.selectItems = [
    { value: '1', label: 'Aspirin' },
    { value: '2', label: 'Ibuprofen' }
  ];

  beforeEach(async () => {
    mockDiagnosisXDrugData = jasmine.createSpyObj('DiagnosisXDrugData', ['AddDiagnosisXDrug']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockDiagnosisData = jasmine.createSpyObj('DiagnosisData', ['GetDiagnosesDropdown']);
    mockDrugData = jasmine.createSpyObj('DrugData', ['GetDrugsDropdown']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    // Set up mock responses
    mockDiagnosisData.GetDiagnosesDropdown.and.returnValue(of(mockDiagnosesList));
    mockDrugData.GetDrugsDropdown.and.returnValue(of(mockDrugsList));
    mockDiagnosisXDrugData.AddDiagnosisXDrug.and.returnValue(of({
      succeeded: true,
      errors: [],
      successMessage: 'Diagnosis-drug relation added successfully'
    }));

    await TestBed.configureTestingModule({
      imports: [
        DiagnosisXDrugComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: DiagnosisXDrugData, useValue: mockDiagnosisXDrugData },
        { provide: UIService, useValue: mockUIService },
        { provide: DiagnosisData, useValue: mockDiagnosisData },
        { provide: DrugData, useValue: mockDrugData },
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

    fixture = TestBed.createComponent(DiagnosisXDrugComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.diagnosisXDrugForm).toBeDefined();
    expect(component.diagnosisXDrugForm.get('diagnosisId')).toBeDefined();
    expect(component.diagnosisXDrugForm.get('drugId')).toBeDefined();
  });

  it('should load diagnoses dropdown', () => {
    expect(mockDiagnosisData.GetDiagnosesDropdown).toHaveBeenCalled();
    expect(component.diagnosisSelectList).toEqual(mockDiagnosesList);
  });

  it('should load drugs dropdown', () => {
    expect(mockDrugData.GetDrugsDropdown).toHaveBeenCalled();
    expect(component.drugSelectList).toEqual(mockDrugsList);
  });

  it('should validate the form', async () => {
    // Form should be invalid initially
    expect(component.diagnosisXDrugForm.valid).toBeFalse();

    // Select values from dropdowns
    const diagnosisSelect = await loader.getHarness(MatSelectHarness.with({ selector: '[formControlName="diagnosisId"]' }));
    const drugSelect = await loader.getHarness(MatSelectHarness.with({ selector: '[formControlName="drugId"]' }));

    await diagnosisSelect.open();
    await diagnosisSelect.clickOptions({ text: 'Common Cold' });
    await drugSelect.open();
    await drugSelect.clickOptions({ text: 'Aspirin' });

    // Form should be valid now
    expect(component.diagnosisXDrugForm.valid).toBeTrue();
  });

  it('should call goBack when back button is clicked', async () => {
    const backButton = await loader.getHarness(MatButtonHarness.with({ text: 'Back' }));
    await backButton.click();

    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should submit form and add diagnosis-drug relation', () => {
    component.diagnosisXDrugForm.setValue({
      diagnosisId: '1',
      drugId: '2'
    });

    component.onSubmit();

    expect(mockDiagnosisXDrugData.AddDiagnosisXDrug).toHaveBeenCalledWith({
      diagnosisId: 1,
      drugId: 2
    });

    expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith(
      'Diagnosis-drug relation added successfully',
      undefined,
      3000
    );

    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should not submit when form is invalid', () => {
    // Form is initially invalid
    component.onSubmit();

    expect(mockDiagnosisXDrugData.AddDiagnosisXDrug).not.toHaveBeenCalled();
  });
});