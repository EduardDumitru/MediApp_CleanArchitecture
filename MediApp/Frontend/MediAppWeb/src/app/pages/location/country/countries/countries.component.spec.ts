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

import { CountriesComponent } from './countries.component';
import { CountryData } from 'src/app/@core/data/country';
import { UIService } from 'src/app/shared/ui.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CountriesComponent', () => {
  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;

  // Mock services
  let mockCountryData: jasmine.SpyObj<CountryData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    // Create spy objects for services
    mockCountryData = jasmine.createSpyObj('CountryData', ['GetCountries']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Set up mock return values
    mockCountryData.GetCountries.and.returnValue(
      of({
        countries: [
          {
            id: 1,
            name: 'Test Country',
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
        RouterTestingModule
      ],
      declarations: [CountriesComponent],
      providers: [
        { provide: CountryData, useValue: mockCountryData },
        { provide: UIService, useValue: mockUIService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load countries on init', () => {
    expect(mockCountryData.GetCountries).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Test Country');
  });

  it('should filter data', () => {
    // Arrange
    const dataSource = component.dataSource;

    // Act
    component.doFilter('test');

    // Assert
    expect(dataSource.filter).toBe('test');
  });

  it('should navigate to country details', () => {
    // Act
    component.navigateToCountry(1);

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/location/countries', 1]);
  });

  it('should navigate to add country page', () => {
    // Act
    component.addNewCountry();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/location/countries/add']);
  });
});