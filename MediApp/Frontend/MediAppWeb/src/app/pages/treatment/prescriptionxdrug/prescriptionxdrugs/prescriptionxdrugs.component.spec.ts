import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrescriptionXDrugsComponent } from './prescriptionxdrugs.component';

describe('PrescriptionXDrugsComponent', () => {
  let component: PrescriptionXDrugsComponent;
  let fixture: ComponentFixture<PrescriptionXDrugsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionXDrugsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionXDrugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
