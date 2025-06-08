import { Component, OnInit, Output, EventEmitter, OnDestroy, inject } from '@angular/core';
import { takeUntil, Subject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { getSharedImports } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    ...getSharedImports(),
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();

  isAuth = false;
  isAdmin = false;
  isDoctor = false;
  isNurse = false;
  currentUserId = -1;

  // Use inject instead of constructor injection
  private readonly authService = inject(AuthService);

  // Stream to handle unsubscription
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
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
  }

  ngOnDestroy(): void {
    // Single unsubscription for all subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClose(): void {
    this.closeSidenav.emit();
  }

  onLogout(): void {
    this.onClose();
    this.authService.logout();
  }
}