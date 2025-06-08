import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of, Subject } from 'rxjs';

import { UpdateMedicalCheckComponent } from './update-medical-check.component';
import { MedicalCheckData } from 'src/app/@core/data/medicalcheck';
import { UIService } from 'src/app/shared/ui.service';
import { DiagnosisData } from 'src/app/@core/data/diagnosis';
import { AuthService } from 'src/app/auth/auth.service';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UpdateMedicalCheckComponent', () => {
  let component: UpdateMedicalCheckComponent;
  let fixture: ComponentFixture<UpdateMedicalCheckComponent>;

  // Mock services
  let mockMedicalCheckData: jasmine.SpyObj<MedicalCheckData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockDiagnosisData: jasmine.SpyObj<DiagnosisData>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  // Subject for nurse role
  const isNurseSubject = new Subject<boolean>();

  beforeEach(waitForAsync(() => {
    // Create spy objects for services
    mockMedicalCheckData = jasmine.createSpyObj('MedicalCheckData', [
      'GetMedicalCheckDetails',
      'UpdateMedicalCheck',
      'DeleteMedicalCheck'
    ]);
    mockUIService = jasmine.createSpyObj('UIService', [
      'showErrorSnackbar',
      'showSuccessSnackbar'
    ]);
    mockDiagnosisData = jasmine.createSpyObj('DiagnosisData', ['GetDiagnosesDropdown']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      isNurse: isNurseSubject.asObservable()
    });

    // Set up return values
    mockMedicalCheckData.GetMedicalCheckDetails.and.returnValue(
      of({
        id: 1,
        appointment: new Date(),
        medicalCheckTypeId: 1,
        medicalCheckTypeName: 'Test Check',
        clinicId: 1,
        clinicName: 'Test Clinic',
        employeeId: 1,
        employeeName: 'Dr. Test',
        patientId: 1,
        patientName: 'Test Patient',
        patientCnp: '1234567890123',
        diagnosisId: 1,
        diagnosisName: 'Test Diagnosis',
        deleted: false,
        hasPrescriptions: false
      })
    );
    mockMedicalCheckData.UpdateMedicalCheck.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Updated successfully' }));
    mockMedicalCheckData.DeleteMedicalCheck.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Deleted successfully' }));;
    mockDiagnosisData.GetDiagnosesDropdown.and.returnValue(of(new SelectItemsList()));

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [UpdateMedicalCheckComponent],
      providers: [
        { provide: MedicalCheckData, useValue: mockMedicalCheckData },
        { provide: UIService, useValue: mockUIService },
        { provide: DiagnosisData, useValue: mockDiagnosisData },
        { provide: Location, useValue: mockLocation },
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: '1' }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMedicalCheckComponent);
    component = fixture.componentInstance;

    // Set initial nurse status
    isNurseSubject.next(false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medical check details on init', () => {
    expect(mockMedicalCheckData.GetMedicalCheckDetails).toHaveBeenCalledWith(1);
    expect(component.medicalCheckForm.get('clinicName')?.value).toBe('Test Clinic');
  });

  it('should load diagnoses on init', () => {
    expect(mockDiagnosisData.GetDiagnosesDropdown).toHaveBeenCalled();
  });

  it('should disable form if user is nurse', () => {
    // Arrange
    component.isDeleted = false;
    component.medicalCheckForm.enable();

    // Act
    isNurseSubject.next(true);
    mockMedicalCheckData.GetMedicalCheckDetails.calls.reset();
    component.getMedicalCheck();
    fixture.detectChanges();

    // Assert
    expect(component.isNurse).toBeTrue();
    expect(component.isDeleted).toBeTrue();
    expect(component.medicalCheckForm.disabled).toBeTrue();
  });

  it('should update medical check when form is submitted', () => {
    // Arrange
    component.medicalCheckForm.patchValue({
      diagnosisId: '2'
    });

    // Act
    component.onSubmit();

    // Assert
    expect(mockMedicalCheckData.UpdateMedicalCheck).toHaveBeenCalledWith({
      id: 1,
      diagnosisId: 2
    });
  });

  it('should delete medical check and navigate back', () => {
    // Act
    component.deleteMedicalCheck();

    // Assert
    expect(mockMedicalCheckData.DeleteMedicalCheck).toHaveBeenCalledWith(1);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should go back when goBack is called', () => {
    // Act
    component.goBack();

    // Assert
    expect(mockLocation.back).toHaveBeenCalled();
  });
});