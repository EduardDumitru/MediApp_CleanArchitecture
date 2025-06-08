import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { MedicalchecktypeComponent } from './medicalchecktype.component';
import { MedicalCheckTypeData } from 'src/app/@core/data/medicalchecktype';
import { UIService } from 'src/app/shared/ui.service';

describe('MedicalchecktypeComponent', () => {
  let component: MedicalchecktypeComponent;
  let fixture: ComponentFixture<MedicalchecktypeComponent>;
  let mockMedicalCheckTypeData: jasmine.SpyObj<MedicalCheckTypeData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockMedicalCheckTypeData = jasmine.createSpyObj('MedicalCheckTypeData', [
      'GetMedicalCheckTypeDetails',
      'AddMedicalCheckType',
      'UpdateMedicalCheckType',
      'DeleteMedicalCheckType',
      'RestoreMedicalCheckType'
    ]);

    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        MedicalchecktypeComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MedicalCheckTypeData, useValue: mockMedicalCheckTypeData },
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

    fixture = TestBed.createComponent(MedicalchecktypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the medical check type form', () => {
    expect(component.medicalCheckTypeForm).toBeDefined();
    expect(component.medicalCheckTypeForm.get('name')).toBeDefined();
  });

  it('should validate the medical check type form', () => {
    const nameControl = component.medicalCheckTypeForm.get('name');

    // Initially form should be invalid
    expect(component.medicalCheckTypeForm.valid).toBeFalsy();

    // Set valid values
    nameControl?.setValue('Test Medical Check Type');
    expect(component.medicalCheckTypeForm.valid).toBeTruthy();

    // Set invalid values
    nameControl?.setValue('');
    expect(component.medicalCheckTypeForm.valid).toBeFalsy();
  });

  it('should call goBack when back button is clicked', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should add medical check type when form is submitted and no medicalCheckTypeId exists', () => {
    mockMedicalCheckTypeData.AddMedicalCheckType.and.returnValue(of({
      succeeded: true,
      errors: [],
      successMessage: 'Medical Check Type added successfully'
    }));

    component.medicalCheckTypeForm.setValue({
      name: 'New Medical Check Type'
    });

    component.onSubmit();

    expect(mockMedicalCheckTypeData.AddMedicalCheckType).toHaveBeenCalledWith({
      name: 'New Medical Check Type'
    });
    expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Medical Check Type added successfully', undefined, 3000);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should not submit when form is invalid', () => {
    component.medicalCheckTypeForm.setValue({
      name: ''
    });

    component.onSubmit();

    expect(mockMedicalCheckTypeData.AddMedicalCheckType).not.toHaveBeenCalled();
    expect(mockMedicalCheckTypeData.UpdateMedicalCheckType).not.toHaveBeenCalled();
  });

  describe('when editing an existing medical check type', () => {
    beforeEach(() => {
      // Reset and setup for edit mode
      TestBed.resetTestingModule();

      mockMedicalCheckTypeData = jasmine.createSpyObj('MedicalCheckTypeData', [
        'GetMedicalCheckTypeDetails',
        'AddMedicalCheckType',
        'UpdateMedicalCheckType',
        'DeleteMedicalCheckType',
        'RestoreMedicalCheckType'
      ]);

      mockMedicalCheckTypeData.GetMedicalCheckTypeDetails.and.returnValue(of({
        id: 1,
        name: 'Existing Medical Check Type',
        deleted: false
      }));

      mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
      mockLocation = jasmine.createSpyObj('Location', ['back']);

      TestBed.configureTestingModule({
        imports: [
          MedicalchecktypeComponent,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: MedicalCheckTypeData, useValue: mockMedicalCheckTypeData },
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

      fixture = TestBed.createComponent(MedicalchecktypeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should load medical check type details when medicalCheckTypeId is provided', () => {
      expect(mockMedicalCheckTypeData.GetMedicalCheckTypeDetails).toHaveBeenCalledWith(1);
      expect(component.medicalCheckTypeForm.get('name')?.value).toBe('Existing Medical Check Type');
    });

    it('should update medical check type when form is submitted', () => {
      mockMedicalCheckTypeData.UpdateMedicalCheckType.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Medical Check Type updated successfully'
      }));

      component.medicalCheckTypeForm.setValue({
        name: 'Updated Medical Check Type'
      });

      component.onSubmit();

      expect(mockMedicalCheckTypeData.UpdateMedicalCheckType).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Medical Check Type'
      });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Medical Check Type updated successfully', undefined, 3000);
    });

    it('should delete medical check type when delete button is clicked', () => {
      mockMedicalCheckTypeData.DeleteMedicalCheckType.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Medical Check Type deleted successfully'
      }));

      component.deleteMedicalCheckType();

      expect(mockMedicalCheckTypeData.DeleteMedicalCheckType).toHaveBeenCalledWith(1);
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Medical Check Type deleted successfully', undefined, 3000);
    });

    it('should restore medical check type when restore button is clicked', () => {
      mockMedicalCheckTypeData.RestoreMedicalCheckType.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Medical Check Type restored successfully'
      }));

      component.restoreMedicalCheckType();

      expect(mockMedicalCheckTypeData.RestoreMedicalCheckType).toHaveBeenCalledWith({ id: 1 });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Medical Check Type restored successfully', undefined, 3000);
    });
  });
});