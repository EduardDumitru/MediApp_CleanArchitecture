import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { DrugComponent } from './drug.component';
import { DrugData } from 'src/app/@core/data/drug';
import { UIService } from 'src/app/shared/ui.service';

describe('DrugComponent', () => {
  let component: DrugComponent;
  let fixture: ComponentFixture<DrugComponent>;
  let mockDrugData: jasmine.SpyObj<DrugData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockDrugData = jasmine.createSpyObj('DrugData', [
      'GetDrugDetails',
      'AddDrug',
      'UpdateDrug',
      'DeleteDrug',
      'RestoreDrug'
    ]);

    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        DrugComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: DrugData, useValue: mockDrugData },
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

    fixture = TestBed.createComponent(DrugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the drug form', () => {
    expect(component.drugForm).toBeDefined();
    expect(component.drugForm.get('name')).toBeDefined();
  });

  it('should validate the drug form', () => {
    const nameControl = component.drugForm.get('name');

    // Initially form should be invalid
    expect(component.drugForm.valid).toBeFalsy();

    // Set valid values
    nameControl?.setValue('Test Drug');
    expect(component.drugForm.valid).toBeTruthy();

    // Set invalid values
    nameControl?.setValue('');
    expect(component.drugForm.valid).toBeFalsy();
  });

  it('should call goBack when back button is clicked', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should add drug when form is submitted and no drugId exists', () => {
    mockDrugData.AddDrug.and.returnValue(of({
      succeeded: true,
      errors: [],
      successMessage: 'Drug added successfully'
    }));

    component.drugForm.setValue({
      name: 'New Drug'
    });

    component.onSubmit();

    expect(mockDrugData.AddDrug).toHaveBeenCalledWith({
      name: 'New Drug'
    });
    expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Drug added successfully', undefined, 3000);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should not submit when form is invalid', () => {
    component.drugForm.setValue({
      name: ''
    });

    component.onSubmit();

    expect(mockDrugData.AddDrug).not.toHaveBeenCalled();
    expect(mockDrugData.UpdateDrug).not.toHaveBeenCalled();
  });

  describe('when editing an existing drug', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();

      mockDrugData = jasmine.createSpyObj('DrugData', [
        'GetDrugDetails',
        'AddDrug',
        'UpdateDrug',
        'DeleteDrug',
        'RestoreDrug'
      ]);

      mockDrugData.GetDrugDetails.and.returnValue(of({
        id: 1,
        name: 'Existing Drug',
        deleted: false
      }));

      mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
      mockLocation = jasmine.createSpyObj('Location', ['back']);

      TestBed.configureTestingModule({
        imports: [
          DrugComponent,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: DrugData, useValue: mockDrugData },
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

      fixture = TestBed.createComponent(DrugComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should load drug details when drugId is provided', () => {
      expect(mockDrugData.GetDrugDetails).toHaveBeenCalledWith(1);
      expect(component.drugForm.get('name')?.value).toBe('Existing Drug');
    });

    it('should update drug when form is submitted', () => {
      mockDrugData.UpdateDrug.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Drug updated successfully'
      }));

      component.drugForm.setValue({
        name: 'Updated Drug'
      });

      component.onSubmit();

      expect(mockDrugData.UpdateDrug).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Drug'
      });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Drug updated successfully', undefined, 3000);
    });

    it('should delete drug when delete button is clicked', () => {
      mockDrugData.DeleteDrug.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Drug deleted successfully'
      }));

      component.deleteDrug();

      expect(mockDrugData.DeleteDrug).toHaveBeenCalledWith(1);
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Drug deleted successfully', undefined, 3000);
    });

    it('should restore drug when restore button is clicked', () => {
      mockDrugData.RestoreDrug.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Drug restored successfully'
      }));

      component.restoreDrug();

      expect(mockDrugData.RestoreDrug).toHaveBeenCalledWith({ id: 1 });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Drug restored successfully', undefined, 3000);
    });
  });
});