import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionxdrugComponent } from './prescriptionxdrug.component';

describe('PrescriptionxdrugComponent', () => {
  let component: PrescriptionxdrugComponent;
  let fixture: ComponentFixture<PrescriptionxdrugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionxdrugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionxdrugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
