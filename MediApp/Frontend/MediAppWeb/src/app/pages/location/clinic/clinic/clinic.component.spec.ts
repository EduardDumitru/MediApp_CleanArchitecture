import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { ClinicComponent } from './clinic.component';
import { ClinicData } from 'src/app/@core/data/clinic';
import { CountryData } from 'src/app/@core/data/country';
import { CountyData } from 'src/app/@core/data/county';
import { CityData } from 'src/app/@core/data/city';
import { UIService } from 'src/app/shared/ui.service';
import { SelectItemsList } from 'src/app/@core/data/common/selectitem';

describe('ClinicComponent', () => {
  let component: ClinicComponent;
  let fixture: ComponentFixture<ClinicComponent>;
  let mockClinicData: jasmine.SpyObj<ClinicData>;
  let mockCountryData: jasmine.SpyObj<CountryData>;
  let mockCountyData: jasmine.SpyObj<CountyData>;
  let mockCityData: jasmine.SpyObj<CityData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockClinicData = jasmine.createSpyObj('ClinicData', [
      'GetClinicDetails',
      'AddClinic',
      'UpdateClinic',
      'DeleteClinic',
      'RestoreClinic'
    ]);

    mockCountryData = jasmine.createSpyObj('CountryData', ['GetCountriesDropdown']);
    mockCountyData = jasmine.createSpyObj('CountyData', ['GetCountiesByCountryDropdown']);
    mockCityData = jasmine.createSpyObj('CityData', ['GetCitiesByCountyDropdown']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    const countriesSelectList = new SelectItemsList();
    countriesSelectList.selectItems = [
      { label: 'Country 1', value: '1' },
      { label: 'Country 2', value: '2' }
    ];

    const countiesSelectList = new SelectItemsList();
    countiesSelectList.selectItems = [
      { label: 'County 1', value: '1' },
      { label: 'County 2', value: '2' }
    ];

    const citiesSelectList = new SelectItemsList();
    citiesSelectList.selectItems = [
      { label: 'City 1', value: '1' },
      { label: 'City 2', value: '2' }
    ];

    mockCountryData.GetCountriesDropdown.and.returnValue(of(countriesSelectList));
    mockCountyData.GetCountiesByCountryDropdown.and.returnValue(of(countiesSelectList));
    mockCityData.GetCitiesByCountyDropdown.and.returnValue(of(citiesSelectList));

    await TestBed.configureTestingModule({
      imports: [
        ClinicComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ClinicData, useValue: mockClinicData },
        { provide: CountryData, useValue: mockCountryData },
        { provide: CountyData, useValue: mockCountyData },
        { provide: CityData, useValue: mockCityData },
        { provide: UIService, useValue: mockUIService },
        { provide: Location, useValue: mockLocation },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {}
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the clinic form', () => {
    expect(component.clinicForm).toBeDefined();
    expect(component.clinicForm.get('name')).toBeDefined();
    expect(component.clinicForm.get('countryId')).toBeDefined();
    expect(component.clinicForm.get('countyId')).toBeDefined();
    expect(component.clinicForm.get('cityId')).toBeDefined();
    expect(component.clinicForm.get('address')).toBeDefined();
    expect(component.clinicForm.get('streetName')).toBeDefined();
    expect(component.clinicForm.get('streetNo')).toBeDefined();
    expect(component.clinicForm.get('email')).toBeDefined();
    expect(component.clinicForm.get('phoneNumber')).toBeDefined();
  });

  it('should load countries on init', () => {
    expect(mockCountryData.GetCountriesDropdown).toHaveBeenCalled();
    expect(component.countrySelectList.selectItems?.length).toBe(2);
  });

  it('should validate the clinic form', () => {
    const nameControl = component.clinicForm.get('name');
    const countryIdControl = component.clinicForm.get('countryId');
    const countyIdControl = component.clinicForm.get('countyId');
    const cityIdControl = component.clinicForm.get('cityId');
    const streetNoControl = component.clinicForm.get('streetNo');
    const emailControl = component.clinicForm.get('email');
    const phoneNumberControl = component.clinicForm.get('phoneNumber');

    // Initially form should be invalid
    expect(component.clinicForm.valid).toBeFalsy();

    // Set valid values
    nameControl?.setValue('Test Clinic');
    countryIdControl?.setValue('1');
    countyIdControl?.setValue('1');
    cityIdControl?.setValue('1');
    streetNoControl?.setValue('123');
    emailControl?.setValue('test@example.com');
    phoneNumberControl?.setValue('0712345678');

    expect(component.clinicForm.valid).toBeTruthy();

    // Set invalid values
    nameControl?.setValue('');
    expect(component.clinicForm.valid).toBeFalsy();

    nameControl?.setValue('Test Clinic');
    emailControl?.setValue('invalid-email');
    expect(component.clinicForm.valid).toBeFalsy();

    emailControl?.setValue('test@example.com');
    phoneNumberControl?.setValue('123');
    expect(component.clinicForm.valid).toBeFalsy();
  });

  it('should call getCountiesSelect when country selection changes', () => {
    spyOn(component, 'getCountiesSelect');
    component.getCountiesSelectOnChange('1');
    expect(component.getCountiesSelect).toHaveBeenCalledWith('1');
  });

  it('should call getCitiesSelect when county selection changes', () => {
    spyOn(component, 'getCitiesSelect');
    component.getCitiesSelect('1');
    expect(component.getCitiesSelect).toHaveBeenCalledWith('1');
  });

  it('should call goBack when back button is clicked', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should add clinic when form is submitted and no clinicId exists', () => {
    mockClinicData.AddClinic.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Clinic added successfully' }));

    component.clinicForm.setValue({
      name: 'New Clinic',
      countryId: '1',
      countyId: '1',
      cityId: '1',
      address: 'Address',
      streetName: 'Street',
      streetNo: '123',
      email: 'test@example.com',
      phoneNumber: '0712345678'
    });

    component.onSubmit();

    expect(mockClinicData.AddClinic).toHaveBeenCalledWith({
      name: 'New Clinic',
      countryId: 1,
      countyId: 1,
      cityId: 1,
      address: 'Address',
      streetName: 'Street',
      streetNo: '123',
      email: 'test@example.com',
      phoneNumber: '0712345678'
    });
    expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Clinic added successfully', undefined, 3000);
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should not submit when form is invalid', () => {
    component.clinicForm.setValue({
      name: '',
      countryId: '',
      countyId: '',
      cityId: '',
      address: '',
      streetName: '',
      streetNo: '',
      email: '',
      phoneNumber: ''
    });

    component.onSubmit();

    expect(mockClinicData.AddClinic).not.toHaveBeenCalled();
    expect(mockClinicData.UpdateClinic).not.toHaveBeenCalled();
  });

  describe('when editing an existing clinic', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();

      mockClinicData = jasmine.createSpyObj('ClinicData', [
        'GetClinicDetails',
        'AddClinic',
        'UpdateClinic',
        'DeleteClinic',
        'RestoreClinic'
      ]);

      mockClinicData.GetClinicDetails.and.returnValue(of({
        id: 1,
        name: 'Existing Clinic',
        countryId: 2,
        countryName: 'Country 2',
        countyId: 2,
        countyName: 'County 2',
        cityId: 2,
        cityName: 'City 2',
        address: 'Address',
        streetName: 'Street',
        streetNo: '123',
        email: 'clinic@example.com',
        phoneNumber: '0712345678',
        deleted: false
      }));

      mockCountryData = jasmine.createSpyObj('CountryData', ['GetCountriesDropdown']);
      mockCountyData = jasmine.createSpyObj('CountyData', ['GetCountiesByCountryDropdown']);
      mockCityData = jasmine.createSpyObj('CityData', ['GetCitiesByCountyDropdown']);
      mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar', 'showSuccessSnackbar']);
      mockLocation = jasmine.createSpyObj('Location', ['back']);

      const countriesSelectList = new SelectItemsList();
      countriesSelectList.selectItems = [
        { label: 'Country 1', value: '1' },
        { label: 'Country 2', value: '2' }
      ];

      const countiesSelectList = new SelectItemsList();
      countiesSelectList.selectItems = [
        { label: 'County 1', value: '1' },
        { label: 'County 2', value: '2' }
      ];

      const citiesSelectList = new SelectItemsList();
      citiesSelectList.selectItems = [
        { label: 'City 1', value: '1' },
        { label: 'City 2', value: '2' }
      ];

      mockCountryData.GetCountriesDropdown.and.returnValue(of(countriesSelectList));
      mockCountyData.GetCountiesByCountryDropdown.and.returnValue(of(countiesSelectList));
      mockCityData.GetCitiesByCountyDropdown.and.returnValue(of(citiesSelectList));

      TestBed.configureTestingModule({
        imports: [
          ClinicComponent,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: ClinicData, useValue: mockClinicData },
          { provide: CountryData, useValue: mockCountryData },
          { provide: CountyData, useValue: mockCountyData },
          { provide: CityData, useValue: mockCityData },
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
        ]
      });

      fixture = TestBed.createComponent(ClinicComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should load clinic details when clinicId is provided', () => {
      expect(mockClinicData.GetClinicDetails).toHaveBeenCalledWith(1);
      expect(component.clinicForm.get('name')?.value).toBe('Existing Clinic');
      expect(component.clinicForm.get('countryId')?.value).toBe('2');
      expect(component.clinicForm.get('countyId')?.value).toBe('2');
      expect(component.clinicForm.get('cityId')?.value).toBe('2');
    });

    it('should update clinic when form is submitted', () => {
      mockClinicData.UpdateClinic.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Clinic updated successfully' }));

      component.clinicForm.setValue({
        name: 'Updated Clinic',
        countryId: '1',
        countyId: '1',
        cityId: '1',
        address: 'Updated Address',
        streetName: 'Updated Street',
        streetNo: '456',
        email: 'updated@example.com',
        phoneNumber: '0723456789'
      });

      component.onSubmit();

      expect(mockClinicData.UpdateClinic).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Clinic',
        countryId: 1,
        countyId: 1,
        cityId: 1,
        address: 'Updated Address',
        streetName: 'Updated Street',
        streetNo: '456',
        email: 'updated@example.com',
        phoneNumber: '0723456789'
      });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Clinic updated successfully', undefined, 3000);
    });

    it('should delete clinic when delete button is clicked', () => {
      mockClinicData.DeleteClinic.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Clinic deleted successfully' }));

      component.deleteClinic();

      expect(mockClinicData.DeleteClinic).toHaveBeenCalledWith(1);
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Clinic deleted successfully', undefined, 3000);
    });

    it('should restore clinic when restore button is clicked', () => {
      mockClinicData.RestoreClinic.and.returnValue(of({ succeeded: true, errors: [], successMessage: 'Clinic restored successfully' }));

      component.restoreClinic();

      expect(mockClinicData.RestoreClinic).toHaveBeenCalledWith({ id: 1 });
      expect(mockUIService.showSuccessSnackbar).toHaveBeenCalledWith('Clinic restored successfully', undefined, 3000);
    });
  });
});