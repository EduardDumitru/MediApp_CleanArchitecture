import { Component } from '@angular/core';
import { getSharedImports } from './shared/shared.module';
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ...getSharedImports(),
    NavbarComponent,
    SidebarComponent,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { }