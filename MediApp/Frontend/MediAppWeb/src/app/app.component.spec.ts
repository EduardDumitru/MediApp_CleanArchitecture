/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['initAuthListener']);

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]), // Replace RouterTestingModule with provideRouter
        { provide: AuthService, useValue: mockAuthService }
      ],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements like mat-* components
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize auth listener on init', () => {
    component.ngOnInit();
    expect(mockAuthService.initAuthListener).toHaveBeenCalled();
  });
});