import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { BehaviorSubject } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../auth/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let loader: HarnessLoader;

  // Mock observables
  const authChange$ = new BehaviorSubject<boolean>(false);
  const isAdmin$ = new BehaviorSubject<boolean>(false);
  const isDoctor$ = new BehaviorSubject<boolean>(false);
  const isNurse$ = new BehaviorSubject<boolean>(false);
  const currentUserId$ = new BehaviorSubject<number>(-1);
  const clinicId$ = new BehaviorSubject<number>(-1);

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      authChange: authChange$,
      isAdmin: isAdmin$,
      isDoctor: isDoctor$,
      isNurse: isNurse$,
      currentUserId: currentUserId$,
      clinicId: clinicId$
    });

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login and signup when not authenticated', () => {
    authChange$.next(false);
    fixture.detectChanges();

    const loginLink = fixture.nativeElement.querySelector('a[routerLink="/login"]');
    const signupLink = fixture.nativeElement.querySelector('a[routerLink="/register"]');

    expect(loginLink).toBeTruthy();
    expect(signupLink).toBeTruthy();

    const logoutButton = fixture.nativeElement.querySelector('button[mat-button]:contains("Logout")');
    expect(logoutButton).toBeNull();
  });

  it('should show menu items only for admins when user is admin', async () => {
    authChange$.next(true);
    isAdmin$.next(true);
    currentUserId$.next(1);
    fixture.detectChanges();

    const diagnosisButton = await loader.getHarness(
      MatButtonHarness.with({ text: /Diagnosis/ })
    );
    expect(diagnosisButton).toBeTruthy();

    const profileLink = fixture.nativeElement.querySelector(`a[href="/user/profile/1"]`);
    expect(profileLink).toBeTruthy();
  });

  it('should emit sidebarToggle when onToggleSidenav is called', () => {
    spyOn(component.sidebarToggle, 'emit');
    component.onToggleSidenav();
    expect(component.sidebarToggle.emit).toHaveBeenCalled();
  });

  it('should call logout when onLogout is called', () => {
    component.onLogout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should show treatment menu for doctors with doctor-specific items', async () => {
    authChange$.next(true);
    isDoctor$.next(true);
    currentUserId$.next(2);
    fixture.detectChanges();

    const treatmentButton = await loader.getHarness(
      MatButtonHarness.with({ text: /Treatment/ })
    );
    expect(treatmentButton).toBeTruthy();

    await treatmentButton.click();

    const menu = await loader.getHarness(MatMenuHarness);
    const items = await menu.getItems();

    expect(items.length).toBeGreaterThan(2); // Doctor should see multiple treatment options

    // Check for doctor-specific menu items
    const menuItemTexts = await Promise.all(items.map(item => item.getText()));
    expect(menuItemTexts.some(text => text.includes('Doctor Prescriptions'))).toBeTrue();
  });
});