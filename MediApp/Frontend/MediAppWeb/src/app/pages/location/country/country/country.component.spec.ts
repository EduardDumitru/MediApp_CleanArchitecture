import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { CountryComponent } from './country.component';
import { CountryData } from 'src/app/@core/data/country';
import { UIService } from 'src/app/shared/ui.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CountryComponent', () => {
  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;

  // Mock services
  let mockCountryData: jasmine.SpyObj<CountryData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(waitForAsync(() => {
    // Create spy objects for services
    mockCountryData = jasmine.createSpyObj('CountryData', [
      'GetCountryDetails',
      'AddCountry',
      'UpdateCountry',
      'DeleteCountry',
      'RestoreCountry'
    ]);
    mockUIService = jasmine.createSpyObj('UIService', [
      'showErrorSnackbar',
      'showSuccessSnackbar'
    ]);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    // Set up mock return values
    mockCountryData.GetCountryDetails.and.returnValue(
      of({
        id: 1,
        name: 'Test Country',
        deleted: false
      })
    );
    mockCountryData.AddCountry.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Added successfully' }));
    mockCountryData.UpdateCountry.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Updated successfully' }));
    mockCountryData.DeleteCountry.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Deleted successfully' }));
    mockCountryData.RestoreCountry.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Restored successfully' }));

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [CountryComponent],
      providers: [
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
    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load country details on init when ID is provided', () => {
    expect(mockCountryData.GetCountryDetails).toHaveBeenCalledWith(1);
    expect(component.countryForm.get('name')?.value).toBe('Test Country');
  });

  it('should validate country form', () => {
    // Invalid case
    component.countryForm.setValue({ name: '' });
    expect(component.countryForm.valid).toBeFalse();

    // Valid case
    component.countryForm.setValue({ name: 'New Country' });
    expect(component.countryForm.valid).toBeTrue();
  });

  it('should call updateCountry when submitting with an existing ID', () => {
    // Arrange
    spyOn(component, 'updateCountry');
    component.countryId = 1;
    component.countryForm.setValue({ name: 'Updated Country' });

    // Act
    component.onSubmit();

    // Assert
    expect(component.updateCountry).toHaveBeenCalled();
  });

  it('should call addCountry when submitting without an ID', () => {
    // Arrange
    spyOn(component, 'addCountry');
    component.countryId = undefined;
    component.countryForm.setValue({ name: 'New Country' });

    // Act
    component.onSubmit();

    // Assert
    expect(component.addCountry).toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    // Act
    component.goBack();

    // Assert
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should disable form when country is deleted', () => {
    // Arrange
    const deletedCountry = {
      id: 1,
      name: 'Deleted Country',
      deleted: true
    };
    mockCountryData.GetCountryDetails.and.returnValue(of(deletedCountry));

    // Act
    component.getCountry();

    // Assert
    expect(component.isDeleted).toBeTrue();
    expect(component.countryForm.disabled).toBeTrue();
  });
});