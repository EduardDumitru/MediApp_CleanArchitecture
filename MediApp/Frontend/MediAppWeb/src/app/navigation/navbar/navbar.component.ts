import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output()
  sidebarToggle = new EventEmitter<void>();

  isAuth = false;
  isAdmin = false;
  isDoctor = false;
  isNurse = false;
  authSubscription: Subscription;
  adminSubscription: Subscription;
  doctorSubscription: Subscription;
  nurseSubscription: Subscription;

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
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.adminSubscription.unsubscribe();
    this.doctorSubscription.unsubscribe();
    this.nurseSubscription.unsubscribe();
  }

  onToggleSidenav() {
    this.sidebarToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

}
