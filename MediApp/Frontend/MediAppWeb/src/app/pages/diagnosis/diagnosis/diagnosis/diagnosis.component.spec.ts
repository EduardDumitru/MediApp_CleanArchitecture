import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { DiagnosisComponent } from './diagnosis.component';
import { DiagnosisData } from 'src/app/@core/data/diagnosis';
import { UIService } from 'src/app/shared/ui.service';

describe('DiagnosisComponent', () => {
  let component: DiagnosisComponent;
  let fixture: ComponentFixture<DiagnosisComponent>;
  let mockDiagnosisData: jasmine.SpyObj<DiagnosisData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockDiagnosisData = jasmine.createSpyObj('DiagnosisData', [
      'GetDiagnosisDetails',
      'AddDiagnosis',
      'UpdateDiagnosis',
      'DeleteDiagnosis',
      'RestoreDiagnosis'
    ]);

    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        DiagnosisComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: DiagnosisData, useValue: mockDiagnosisData },
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

    fixture = TestBed.createComponent(DiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the diagnosis form', () => {
    expect(component.diagnosisForm).toBeDefined();
    expect(component.diagnosisForm.get('name')).toBeDefined();
  });

  it('should validate the diagnosis form', () => {
    const nameControl = component.diagnosisForm.get('name');

    // Initially form should be invalid
    expect(component.diagnosisForm.valid).toBeFalsy();

    // Set valid values
    nameControl?.setValue('Test Diagnosis');
    expect(component.diagnosisForm.valid).toBeTruthy();

    // Set invalid values
    nameControl?.setValue('');
    expect(component.diagnosisForm.valid).toBeFalsy();
  });

  it('should call goBack when back button is clicked', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should add diagnosis when form is submitted and no diagnosisId exists', () => {
    mockDiagnosisData.AddDiagnosis.and.returnValue(of({
      succeeded: true,
      errors: [],
      successMessage: 'Diagnosis added successfully'
    }));

    component.diagnosisForm.setValue({
      name: 'New Diagnosis'
    });

    component.onSubmit();

    expect(mockDiagnosisData.AddDiagnosis).toHaveBeenCalledWith({
      name: 'New Diagnosis'
    });
    expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Diagnosis added successfully', undefined, 3000);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should not submit when form is invalid', () => {
    component.diagnosisForm.setValue({
      name: ''
    });

    component.onSubmit();

    expect(mockDiagnosisData.AddDiagnosis).not.toHaveBeenCalled();
    expect(mockDiagnosisData.UpdateDiagnosis).not.toHaveBeenCalled();
  });

  describe('when editing an existing diagnosis', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();

      mockDiagnosisData = jasmine.createSpyObj('DiagnosisData', [
        'GetDiagnosisDetails',
        'AddDiagnosis',
        'UpdateDiagnosis',
        'DeleteDiagnosis',
        'RestoreDiagnosis'
      ]);

      mockDiagnosisData.GetDiagnosisDetails.and.returnValue(of({
        id: 1,
        name: 'Existing Diagnosis',
        deleted: false
      }));

      mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
      mockLocation = jasmine.createSpyObj('Location', ['back']);

      TestBed.configureTestingModule({
        imports: [
          DiagnosisComponent,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: DiagnosisData, useValue: mockDiagnosisData },
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

      fixture = TestBed.createComponent(DiagnosisComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should load diagnosis details when diagnosisId is provided', () => {
      expect(mockDiagnosisData.GetDiagnosisDetails).toHaveBeenCalledWith(1);
      expect(component.diagnosisForm.get('name')?.value).toBe('Existing Diagnosis');
    });

    it('should update diagnosis when form is submitted', () => {
      mockDiagnosisData.UpdateDiagnosis.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Diagnosis updated successfully'
      }));

      component.diagnosisForm.setValue({
        name: 'Updated Diagnosis'
      });

      component.onSubmit();

      expect(mockDiagnosisData.UpdateDiagnosis).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Diagnosis'
      });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Diagnosis updated successfully', undefined, 3000);
    });

    it('should delete diagnosis when delete button is clicked', () => {
      mockDiagnosisData.DeleteDiagnosis.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Diagnosis deleted successfully'
      }));

      component.deleteDiagnosis();

      expect(mockDiagnosisData.DeleteDiagnosis).toHaveBeenCalledWith(1);
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Diagnosis deleted successfully', undefined, 3000);
    });

    it('should restore diagnosis when restore button is clicked', () => {
      mockDiagnosisData.RestoreDiagnosis.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Diagnosis restored successfully'
      }));

      component.restoreDiagnosis();

      expect(mockDiagnosisData.RestoreDiagnosis).toHaveBeenCalledWith({ id: 1 });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Diagnosis restored successfully', undefined, 3000);
    });
  });
});