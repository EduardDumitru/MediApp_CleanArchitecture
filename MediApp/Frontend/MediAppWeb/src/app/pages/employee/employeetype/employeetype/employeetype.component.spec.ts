import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { EmployeetypeComponent } from './employeetype.component';
import { EmployeeTypeData } from 'src/app/@core/data/employeetype';
import { UIService } from 'src/app/shared/ui.service';

describe('EmployeetypeComponent', () => {
  let component: EmployeetypeComponent;
  let fixture: ComponentFixture<EmployeetypeComponent>;
  let mockEmployeeTypeData: jasmine.SpyObj<EmployeeTypeData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockEmployeeTypeData = jasmine.createSpyObj('EmployeeTypeData', [
      'GetEmployeeTypeDetails',
      'AddEmployeeType',
      'UpdateEmployeeType',
      'DeleteEmployeeType',
      'RestoreEmployeeType'
    ]);

    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        EmployeetypeComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: EmployeeTypeData, useValue: mockEmployeeTypeData },
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

    fixture = TestBed.createComponent(EmployeetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the employee type form', () => {
    expect(component.employeeTypeForm).toBeDefined();
    expect(component.employeeTypeForm.get('name')).toBeDefined();
  });

  it('should validate the employee type form', () => {
    const nameControl = component.employeeTypeForm.get('name');

    // Initially form should be invalid
    expect(component.employeeTypeForm.valid).toBeFalsy();

    // Set valid values
    nameControl?.setValue('Test Employee Type');
    expect(component.employeeTypeForm.valid).toBeTruthy();

    // Set invalid values
    nameControl?.setValue('');
    expect(component.employeeTypeForm.valid).toBeFalsy();
  });

  it('should call goBack when back button is clicked', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should add employee type when form is submitted and no employeeTypeId exists', () => {
    mockEmployeeTypeData.AddEmployeeType.and.returnValue(of({
      succeeded: true,
      errors: [],
      successMessage: 'Employee Type added successfully'
    }));

    component.employeeTypeForm.setValue({
      name: 'New Employee Type'
    });

    component.onSubmit();

    expect(mockEmployeeTypeData.AddEmployeeType).toHaveBeenCalledWith({
      name: 'New Employee Type'
    });
    expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Employee Type added successfully', undefined, 3000);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should not submit when form is invalid', () => {
    component.employeeTypeForm.setValue({
      name: ''
    });

    component.onSubmit();

    expect(mockEmployeeTypeData.AddEmployeeType).not.toHaveBeenCalled();
    expect(mockEmployeeTypeData.UpdateEmployeeType).not.toHaveBeenCalled();
  });

  describe('when editing an existing employee type', () => {
    beforeEach(() => {
      // Reset and setup for edit mode
      TestBed.resetTestingModule();

      mockEmployeeTypeData = jasmine.createSpyObj('EmployeeTypeData', [
        'GetEmployeeTypeDetails',
        'AddEmployeeType',
        'UpdateEmployeeType',
        'DeleteEmployeeType',
        'RestoreEmployeeType'
      ]);

      mockEmployeeTypeData.GetEmployeeTypeDetails.and.returnValue(of({
        id: 1,
        name: 'Existing Employee Type',
        deleted: false
      }));

      mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
      mockLocation = jasmine.createSpyObj('Location', ['back']);

      TestBed.configureTestingModule({
        imports: [
          EmployeetypeComponent,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: EmployeeTypeData, useValue: mockEmployeeTypeData },
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

      fixture = TestBed.createComponent(EmployeetypeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should load employee type details when employeeTypeId is provided', () => {
      expect(mockEmployeeTypeData.GetEmployeeTypeDetails).toHaveBeenCalledWith(1);
      expect(component.employeeTypeForm.get('name')?.value).toBe('Existing Employee Type');
    });

    it('should update employee type when form is submitted', () => {
      mockEmployeeTypeData.UpdateEmployeeType.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Employee Type updated successfully'
      }));

      component.employeeTypeForm.setValue({
        name: 'Updated Employee Type'
      });

      component.onSubmit();

      expect(mockEmployeeTypeData.UpdateEmployeeType).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Employee Type'
      });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Employee Type updated successfully', undefined, 3000);
    });

    it('should delete employee type when delete button is clicked', () => {
      mockEmployeeTypeData.DeleteEmployeeType.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Employee Type deleted successfully'
      }));

      component.deleteEmployeeType();

      expect(mockEmployeeTypeData.DeleteEmployeeType).toHaveBeenCalledWith(1);
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Employee Type deleted successfully', undefined, 3000);
    });

    it('should restore employee type when restore button is clicked', () => {
      mockEmployeeTypeData.RestoreEmployeeType.and.returnValue(of({
        succeeded: true,
        errors: [],
        successMessage: 'Employee Type restored successfully'
      }));

      component.restoreEmployeeType();

      expect(mockEmployeeTypeData.RestoreEmployeeType).toHaveBeenCalledWith({ id: 1 });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Employee Type restored successfully', undefined, 3000);
    });
  });
});