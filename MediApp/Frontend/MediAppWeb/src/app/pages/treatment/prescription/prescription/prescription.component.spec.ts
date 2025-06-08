import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrescriptionComponent } from './prescription.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PrescriptionData } from 'src/app/@core/data/prescription';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MedicalCheckData } from 'src/app/@core/data/medicalcheck';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PrescriptionComponent', () => {
  let component: PrescriptionComponent;
  let fixture: ComponentFixture<PrescriptionComponent>;
  let mockPrescriptionData: jasmine.SpyObj<PrescriptionData>;
  let mockMedicalCheckData: jasmine.SpyObj<MedicalCheckData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;

  const adminSubject = new Subject<boolean>();
  const doctorSubject = new Subject<boolean>();

  beforeEach(waitForAsync(() => {
    mockPrescriptionData = jasmine.createSpyObj('PrescriptionData', [
      'GetPrescriptionDetails', 'UpdatePrescription', 'AddPrescription', 'DeletePrescription'
    ]);
    mockMedicalCheckData = jasmine.createSpyObj('MedicalCheckData', ['GetMedicalCheckDetails']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      isAdmin: adminSubject.asObservable(),
      isDoctor: doctorSubject.asObservable()
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule],
      declarations: [PrescriptionComponent],
      providers: [
        FormBuilder,
        { provide: PrescriptionData, useValue: mockPrescriptionData },
        { provide: MedicalCheckData, useValue: mockMedicalCheckData },
        { provide: UIService, useValue: mockUIService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              params: { prescriptionId: '1' }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    mockPrescriptionData.GetPrescriptionDetails.and.returnValue(of({
      id: 1,
      noOfDays: 5,
      description: 'Test description',
      medicalCheckId: 1,
      medicalCheckTypeName: 'Test type',
      diagnosisName: 'Test diagnosis',
      clinicName: 'Test clinic',
      employeeName: 'Test employee',
      patientName: 'Test patient',
      deleted: false
    }));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    adminSubject.next(true);
    doctorSubject.next(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load prescription details on init', () => {
    expect(mockPrescriptionData.GetPrescriptionDetails).toHaveBeenCalledWith(1);
  });

  it('should have a valid form when filled', () => {
    expect(component.prescriptionForm.valid).toBeTrue();
  });
});