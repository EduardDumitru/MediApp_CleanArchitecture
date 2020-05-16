import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output()
  sidebarToggle = new EventEmitter<void>();

  isAuth = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.isAuthenticated();
  }

  onToggleSidenav() {
    this.sidebarToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

}
