import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EmployeeMedicalChecksComponent } from './employeemedicalchecks.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MedicalCheckData } from 'src/app/@core/data/medicalcheck';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EmployeeMedicalChecksComponent', () => {
  let component: EmployeeMedicalChecksComponent;
  let fixture: ComponentFixture<EmployeeMedicalChecksComponent>;
  let mockMedicalCheckData: jasmine.SpyObj<MedicalCheckData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const adminSubject = new Subject<boolean>();
  const doctorSubject = new Subject<boolean>();
  const nurseSubject = new Subject<boolean>();
  const userIdSubject = new Subject<number>();

  beforeEach(waitForAsync(() => {
    mockMedicalCheckData = jasmine.createSpyObj('MedicalCheckData', ['GetEmployeeMedicalChecks']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      isAdmin: adminSubject.asObservable(),
      isDoctor: doctorSubject.asObservable(),
      isNurse: nurseSubject.asObservable(),
      currentUserId: userIdSubject.asObservable()
    });

    mockMedicalCheckData.GetEmployeeMedicalChecks.and.returnValue(
      of({ employeeMedicalChecks: [] })
    );

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        NoopAnimationsModule
      ],
      declarations: [EmployeeMedicalChecksComponent],
      providers: [
        { provide: MedicalCheckData, useValue: mockMedicalCheckData },
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
    fixture = TestBed.createComponent(EmployeeMedicalChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Simulate auth states
    adminSubject.next(true);
    doctorSubject.next(false);
    nurseSubject.next(false);
    userIdSubject.next(100);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medical checks when user is admin', () => {
    jasmine.clock().install();
    adminSubject.next(true);
    fixture.detectChanges();

    jasmine.clock().tick(1);
    expect(mockMedicalCheckData.GetEmployeeMedicalChecks).toHaveBeenCalledWith(1);
    jasmine.clock().uninstall();
  });

  it('should filter data', () => {
    const dataSource = component.dataSource;

    component.doFilter('test');
    expect(dataSource.filter).toBe('test');
  });

  it('should clean up subscriptions on destroy', () => {
    const adminSpy = spyOn(component['adminSubscription'] as any, 'unsubscribe');
    const doctorSpy = spyOn(component['doctorSubscription'] as any, 'unsubscribe');
    const nurseSpy = spyOn(component['nurseSubscription'] as any, 'unsubscribe');
    const userIdSpy = spyOn(component['currentUserIdSubscription'] as any, 'unsubscribe');

    component.ngOnDestroy();

    expect(adminSpy).toHaveBeenCalled();
    expect(doctorSpy).toHaveBeenCalled();
    expect(nurseSpy).toHaveBeenCalled();
    expect(userIdSpy).toHaveBeenCalled();
  });
});