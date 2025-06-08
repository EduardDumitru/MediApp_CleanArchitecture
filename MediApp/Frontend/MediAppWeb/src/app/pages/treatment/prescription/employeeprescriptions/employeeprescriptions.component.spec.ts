import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EmployeePrescriptionsComponent } from './employeeprescriptions.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PrescriptionData } from 'src/app/@core/data/prescription';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('EmployeePrescriptionsComponent', () => {
  let component: EmployeePrescriptionsComponent;
  let fixture: ComponentFixture<EmployeePrescriptionsComponent>;
  let mockPrescriptionData: jasmine.SpyObj<PrescriptionData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const adminSubject = new Subject<boolean>();
  const userIdSubject = new Subject<number>();

  beforeEach(waitForAsync(() => {
    mockPrescriptionData = jasmine.createSpyObj('PrescriptionData', ['GetEmployeePrescriptions']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar']);
    mockAuthService = jasmine.createSpyObj('AuthService', [], {
      isAdmin: adminSubject.asObservable(),
      currentUserId: userIdSubject.asObservable()
    });

    mockPrescriptionData.GetEmployeePrescriptions.and.returnValue(
      of({ employeePrescriptions: [] })
    );

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        NoopAnimationsModule
      ],
      declarations: [EmployeePrescriptionsComponent],
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
    fixture = TestBed.createComponent(EmployeePrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Simulate auth states
    adminSubject.next(true);
    userIdSubject.next(100);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load prescriptions when user is admin', () => {
    jasmine.clock().install();
    adminSubject.next(true);
    fixture.detectChanges();

    jasmine.clock().tick(1);
    expect(mockPrescriptionData.GetEmployeePrescriptions).toHaveBeenCalledWith(1);
    jasmine.clock().uninstall();
  });

  it('should filter data', () => {
    const dataSource = component.dataSource;

    component.doFilter('test');
    expect(dataSource.filter).toBe('test');
  });
});