import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrescriptionXDrugComponent } from './prescriptionxdrug.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DrugData } from 'src/app/@core/data/drug';
import { UIService } from 'src/app/shared/ui.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PrescriptionXDrugComponent', () => {
  let component: PrescriptionXDrugComponent;
  let fixture: ComponentFixture<PrescriptionXDrugComponent>;
  let mockDrugData: jasmine.SpyObj<DrugData>;
  let mockUIService: jasmine.SpyObj<UIService>;
  let formBuilder: FormBuilder;
  let mockForm: FormGroup;

  beforeEach(waitForAsync(() => {
    mockDrugData = jasmine.createSpyObj('DrugData', ['GetDrugsDropdown']);
    mockUIService = jasmine.createSpyObj('UIService', ['showErrorSnackbar']);
    formBuilder = new FormBuilder();

    mockForm = formBuilder.group({
      prescriptionId: [''],
      drugId: [''],
      box: [''],
      perInterval: [''],
      intervalMinutes: [''],
      intervalHours: ['']
    });

    mockDrugData.GetDrugsDropdown.and.returnValue(of({ selectItems: [] }));

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PrescriptionXDrugComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockForm },
        { provide: DrugData, useValue: mockDrugData },
        { provide: UIService, useValue: mockUIService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionXDrugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load drugs in ngOnInit', () => {
    expect(mockDrugData.GetDrugsDropdown).toHaveBeenCalled();
  });
});