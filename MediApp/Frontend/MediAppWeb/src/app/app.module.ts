import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { JwtModule } from '@auth0/angular-jwt';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { SharedModule } from './shared/shared.module';
import { UIService } from './shared/ui.service';
// import { AuthModule } from './auth/auth.module'; // Comment out problematic import
import { RoleGuardService } from './auth/role-guard.service';
import { ErrorService } from './shared/error.service';
import { NotFoundComponent } from './notfound/notfound.component';

@NgModule({
  // declarations array is empty since all components are now standalone
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
        allowedDomains: ['localhost:4200/login', 'localhost:4200/register']
      }
    }),
    CoreModule.forRoot(),
    SharedModule,
    // Import standalone components directly
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    NotFoundComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    AuthService,
    AuthGuardService,
    RoleGuardService,
    UIService,
    ErrorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }