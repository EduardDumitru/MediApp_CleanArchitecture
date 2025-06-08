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

import { CountiesComponent } from './counties.component';
import { CountyData } from 'src/app/@core/data/county';
import { UIService } from 'src/app/shared/ui.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CountiesComponent', () => {
  let component: CountiesComponent;
  let fixture: ComponentFixture<CountiesComponent>;

  // Mock services
  let mockCountyData: jasmine.SpyObj<CountyData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    // Create spy objects for services
    mockCountyData = jasmine.createSpyObj('CountyData', ['GetCounties']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Set up mock return values
    mockCountyData.GetCounties.and.returnValue(
      of({
        counties: [
          {
            id: 1,
            name: 'Test County',
            countryName: 'Test Country',
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
      declarations: [CountiesComponent],
      providers: [
        { provide: CountyData, useValue: mockCountyData },
        { provide: UIService, useValue: mockUIService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load counties on init', () => {
    expect(mockCountyData.GetCounties).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Test County');
  });

  it('should filter data', () => {
    // Arrange
    const dataSource = component.dataSource;

    // Act
    component.doFilter('test');

    // Assert
    expect(dataSource.filter).toBe('test');
  });

  it('should navigate to county details', () => {
    // Act
    component.navigateToCounty(1);

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/location/counties', 1]);
  });

  it('should navigate to add county page', () => {
    // Act
    component.addNewCounty();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/location/counties/add']);
  });
});