import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionXDrugComponent } from './prescriptionxdrug.component';

describe('PrescriptionxdrugComponent', () => {
  let component: PrescriptionXDrugComponent;
  let fixture: ComponentFixture<PrescriptionXDrugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionXDrugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionXDrugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
