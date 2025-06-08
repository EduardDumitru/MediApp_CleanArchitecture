import { Component, OnInit, EventEmitter, Output, OnDestroy, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() sidebarToggle = new EventEmitter<void>();

  isAuth = false;
  isAdmin = false;
  isDoctor = false;
  isNurse = false;
  currentUserId = -1;
  clinicId = -1;

  // Dependency injection using inject function
  private readonly authService = inject(AuthService);

  // Stream to handle unsubscription
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Simplify subscriptions with takeUntil pattern
    this.authService.authChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(authStatus => this.isAuth = authStatus);

    this.authService.isAdmin
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAdmin => this.isAdmin = isAdmin);

    this.authService.isDoctor
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDoctor => this.isDoctor = isDoctor);

    this.authService.isNurse
      .pipe(takeUntil(this.destroy$))
      .subscribe(isNurse => this.isNurse = isNurse);

    this.authService.currentUserId
      .pipe(takeUntil(this.destroy$))
      .subscribe(userId => this.currentUserId = userId);

    this.authService.clinicId
      .pipe(takeUntil(this.destroy$))
      .subscribe(clinicId => this.clinicId = clinicId);
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions at once
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleSidenav(): void {
    this.sidebarToggle.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }
}