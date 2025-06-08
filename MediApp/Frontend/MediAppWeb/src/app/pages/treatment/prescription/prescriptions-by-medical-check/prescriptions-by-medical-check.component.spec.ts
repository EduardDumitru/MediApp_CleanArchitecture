import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrescriptionsByMedicalCheckComponent } from './prescriptions-by-medical-check.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PrescriptionData } from 'src/app/@core/data/prescription';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PrescriptionsByMedicalCheckComponent', () => {
  let component: PrescriptionsByMedicalCheckComponent;
  let fixture: ComponentFixture<PrescriptionsByMedicalCheckComponent>;
  let mockPrescriptionData: jasmine.SpyObj<PrescriptionData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    mockPrescriptionData = jasmine.createSpyObj('PrescriptionData', ['GetPrescriptionsByMedicalCheck']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAdmin']);

    mockPrescriptionData.GetPrescriptionsByMedicalCheck.and.returnValue(
      of({ prescriptionsByMedicalCheck: [] })
    );

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        NoopAnimationsModule
      ],
      declarations: [PrescriptionsByMedicalCheckComponent],
      providers: [
        { provide: PrescriptionData, useValue: mockPrescriptionData },
        { provide: UIService, useValue: mockUIService },
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: ActivatedRoute, useValue: {
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
    fixture = TestBed.createComponent(PrescriptionsByMedicalCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load prescriptions on init', () => {
    expect(mockPrescriptionData.GetPrescriptionsByMedicalCheck).toHaveBeenCalledWith(1);
  });

  it('should filter data', () => {
    const dataSource = component.dataSource;

    component.doFilter('test');
    expect(dataSource.filter).toBe('test');
  });
});