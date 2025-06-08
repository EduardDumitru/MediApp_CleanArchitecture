import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { CountyComponent } from './county.component';
import { CountyData } from 'src/app/@core/data/county';
import { CountryData } from 'src/app/@core/data/country';
import { UIService } from 'src/app/shared/ui.service';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CountyComponent', () => {
  let component: CountyComponent;
  let fixture: ComponentFixture<CountyComponent>;

  // Mock services
  let mockCountyData: jasmine.SpyObj<CountyData>;
  let mockCountryData: jasmine.SpyObj<CountryData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(waitForAsync(() => {
    // Create spy objects for services
    mockCountyData = jasmine.createSpyObj('CountyData', [
      'GetCountyDetails',
      'AddCounty',
      'UpdateCounty',
      'DeleteCounty',
      'RestoreCounty'
    ]);
    mockCountryData = jasmine.createSpyObj('CountryData', ['GetCountriesDropdown']);
    mockUIService = jasmine.createSpyObj('UIService', [
      'showErrorSnackbar',
      'showSuccessSnackbar'
    ]);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    // Set up mock return values
    mockCountyData.GetCountyDetails.and.returnValue(
      of({
        id: 1,
        name: 'Test County',
        countryId: 1,
        countryName: 'Test Country',
        deleted: false
      })
    );
    mockCountyData.AddCounty.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Added successfully' }));
    mockCountyData.UpdateCounty.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Updated successfully' }));
    mockCountyData.DeleteCounty.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Deleted successfully' }));
    mockCountyData.RestoreCounty.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Restored successfully' }));
    mockCountryData.GetCountriesDropdown.and.returnValue(of(new SelectItemsList()));

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [CountyComponent],
      providers: [
        { provide: CountyData, useValue: mockCountyData },
        { provide: CountryData, useValue: mockCountryData },
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
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load county details on init when ID is provided', () => {
    expect(mockCountyData.GetCountyDetails).toHaveBeenCalledWith(1);
    expect(component.countyForm.get('name')?.value).toBe('Test County');
  });

  it('should load country dropdown on init', () => {
    expect(mockCountryData.GetCountriesDropdown).toHaveBeenCalled();
  });

  it('should call updateCounty when submitting with an existing ID', () => {
    // Arrange
    spyOn(component, 'updateCounty');
    component.countyId = 1;
    component.countyForm.patchValue({
      name: 'Updated County',
      countryId: '2'
    });

    // Act
    component.onSubmit();

    // Assert
    expect(component.updateCounty).toHaveBeenCalled();
  });

  it('should call addCounty when submitting without an ID', () => {
    // Arrange
    spyOn(component, 'addCounty');
    component.countyId = undefined;
    component.countyForm.patchValue({
      name: 'New County',
      countryId: '2'
    });

    // Act
    component.onSubmit();

    // Assert
    expect(component.addCounty).toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    // Act
    component.goBack();

    // Assert
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should disable form when county is deleted', () => {
    // Arrange
    const deletedCounty = {
      id: 1,
      name: 'Deleted County',
      countryId: 1,
      countryName: 'Test Country',
      deleted: true
    };
    mockCountyData.GetCountyDetails.and.returnValue(of(deletedCounty));

    // Act
    component.getCounty();

    // Assert
    expect(component.isDeleted).toBeTrue();
    expect(component.countyForm.disabled).toBeTrue();
  });
});