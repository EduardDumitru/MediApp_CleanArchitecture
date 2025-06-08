import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MedicalChecksByClinicComponent } from './medical-checks-by-clinic.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MedicalCheckData } from 'src/app/@core/data/medicalcheck';
import { UIService } from 'src/app/shared/ui.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MedicalChecksByClinicComponent', () => {
  let component: MedicalChecksByClinicComponent;
  let fixture: ComponentFixture<MedicalChecksByClinicComponent>;
  let mockMedicalCheckData: jasmine.SpyObj<MedicalCheckData>;
  let mockUIService: jasmine.SpyObj<UIService>;

  beforeEach(waitForAsync(() => {
    mockMedicalCheckData = jasmine.createSpyObj('MedicalCheckData', ['GetMedicalChecksByClinic']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar']);

    mockMedicalCheckData.GetMedicalChecksByClinic.and.returnValue(
      of({ medicalChecksByClinic: [] })
    );

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        NoopAnimationsModule
      ],
      declarations: [MedicalChecksByClinicComponent],
      providers: [
        { provide: MedicalCheckData, useValue: mockMedicalCheckData },
        { provide: UIService, useValue: mockUIService },
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
    fixture = TestBed.createComponent(MedicalChecksByClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medical checks on init', () => {
    expect(mockMedicalCheckData.GetMedicalChecksByClinic).toHaveBeenCalledWith(1);
  });

  it('should filter data', () => {
    const dataSource = component.dataSource;

    component.doFilter('test');
    expect(dataSource.filter).toBe('test');
  });
});