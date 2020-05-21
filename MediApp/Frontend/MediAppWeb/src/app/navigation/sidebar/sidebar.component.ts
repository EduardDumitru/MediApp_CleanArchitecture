import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output()
  closeSidenav = new EventEmitter<void>();

  isAuth = false;
  isAdmin = false;
  isDoctor = false;
  isNurse = false;
  currentUserId = -1;
  authSubscription: Subscription;
  adminSubscription: Subscription;
  doctorSubscription: Subscription;
  nurseSubscription: Subscription;
  currentUserIdSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
    this.adminSubscription = this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    })
    this.doctorSubscription = this.authService.isDoctor.subscribe(isDoctor => {
      this.isDoctor = isDoctor;
    })
    this.nurseSubscription = this.authService.isNurse.subscribe(isNurse => {
      this.isNurse = isNurse;
    })
    this.currentUserIdSubscription = this.authService.currentUserId.subscribe(userId => {
      this.currentUserId = userId;
    })
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
    this.doctorSubscription.unsubscribe();
    this.nurseSubscription.unsubscribe();
    this.currentUserIdSubscription.unsubscribe();
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }
}
