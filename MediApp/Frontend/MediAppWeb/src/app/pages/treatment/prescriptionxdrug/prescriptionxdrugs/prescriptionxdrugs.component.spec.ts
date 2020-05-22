import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionxdrugsComponent } from './prescriptionxdrugs.component';

describe('PrescriptionxdrugsComponent', () => {
  let component: PrescriptionxdrugsComponent;
  let fixture: ComponentFixture<PrescriptionxdrugsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionxdrugsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionxdrugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
