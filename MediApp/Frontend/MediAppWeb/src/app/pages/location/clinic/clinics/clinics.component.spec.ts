import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ClinicsComponent } from './clinics.component';
import { ClinicData } from 'src/app/@core/data/clinic';
import { UIService } from 'src/app/shared/ui.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ClinicsComponent', () => {
  let component: ClinicsComponent;
  let fixture: ComponentFixture<ClinicsComponent>;

  // Mock services
  let mockClinicData: jasmine.SpyObj<ClinicData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    // Create spy objects for services
    mockClinicData = jasmine.createSpyObj('ClinicData', ['GetClinics']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Set up mock return values
    mockClinicData.GetClinics.and.returnValue(
      of({
        clinics: [
          {
            id: 1,
            name: 'Test Clinic',
            countryName: 'Test Country',
            countyName: 'Test County',
            cityName: 'Test City',
            deleted: false
          }
        ]
      })
    );

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
      ],
      declarations: [ClinicsComponent],
      providers: [
        { provide: ClinicData, useValue: mockClinicData },
        { provide: UIService, useValue: mockUIService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clinics on init', () => {
    expect(mockClinicData.GetClinics).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Test Clinic');
  });

  it('should filter data', () => {
    // Arrange
    const dataSource = component.dataSource;

    // Act
    component.doFilter('test');

    // Assert
    expect(dataSource.filter).toBe('test');
  });

  it('should navigate to clinic details', () => {
    // Act
    component.navigateToClinic(1);

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/location/clinics', 1]);
  });

  it('should navigate to add clinic page', () => {
    // Act
    component.addNewClinic();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/location/clinics/add']);
  });
});