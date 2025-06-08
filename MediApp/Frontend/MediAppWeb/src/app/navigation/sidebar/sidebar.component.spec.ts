import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatListItemHarness } from '@angular/material/list/testing';
import { BehaviorSubject } from 'rxjs';

import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../auth/auth.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let loader: HarnessLoader;

  // Mock observables
  const authChange$ = new BehaviorSubject<boolean>(false);
  const isAdmin$ = new BehaviorSubject<boolean>(false);
  const isDoctor$ = new BehaviorSubject<boolean>(false);
  const isNurse$ = new BehaviorSubject<boolean>(false);
  const currentUserId$ = new BehaviorSubject<number>(-1);

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      authChange: authChange$,
      isAdmin: isAdmin$,
      isDoctor: isDoctor$,
      isNurse: isNurse$,
      currentUserId: currentUserId$
    });

    await TestBed.configureTestingModule({
      imports: [
        SidebarComponent,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login and signup when not authenticated', async () => {
    authChange$.next(false);
    fixture.detectChanges();

    const items = await loader.getAllHarnesses(MatListItemHarness.with({ selector: 'a' }));
    expect(items.length).toBe(2);

    const texts = await Promise.all(items.map(item => item.getText()));
    expect(texts).toContain('SignupLogin');
    expect(texts).toContain('Login');
  });

  it('should show authenticated menu items when logged in', async () => {
    authChange$.next(true);
    currentUserId$.next(1);
    fixture.detectChanges();

    const profileLink = await loader.getHarness(
      MatListItemHarness.with({ selector: 'a[routerLink="/user/profile/1"]' })
    );
    expect(await profileLink.getText()).toContain('User Profile');

    const logoutButton = fixture.debugElement.query(
      By.css('button')
    );
    expect(logoutButton).toBeTruthy();
  });

  it('should show admin menu items when user is admin', async () => {
    authChange$.next(true);
    isAdmin$.next(true);
    fixture.detectChanges();

    const items = await loader.getAllHarnesses(MatListItemHarness);
    expect(items.length).toBeGreaterThanOrEqual(7); // 5 admin items plus user profile and logout
  });

  it('should emit closeSidenav when onClose is called', () => {
    spyOn(component.closeSidenav, 'emit');
    component.onClose();
    expect(component.closeSidenav.emit).toHaveBeenCalled();
  });

  it('should logout and close sidenav when onLogout is called', () => {
    spyOn(component, 'onClose');
    component.onLogout();

    expect(component.onClose).toHaveBeenCalled();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});