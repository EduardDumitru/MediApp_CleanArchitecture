import { BrowserModule } from '@angular/platform-browser';
import { ApplicationInitStatus, NgModule, importProvidersFrom, inject } from '@angular/core';
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
import { RoleGuardService } from './auth/role-guard.service';
import { ErrorService } from './shared/error.service';
import { NotFoundComponent } from './notfound/notfound.component';
import { provideAppInitializer } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * This function initializes the AuthService and sets up the authentication listener.
 * It is used as an app initializer to ensure that the authentication state is set up
 * before the application starts.
 */
export function initializeAuth() {
  return () => {
    const authService = inject(AuthService);
    return new Promise<void>((resolve) => {
      console.log('Initializing auth service...');
      // Pass false to avoid navigation during initialization
      authService.initAuthListener(false);
      console.log('Auth initialization complete');
      resolve();
    });
  };
}

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
          return localStorage.getItem(environment.authToken);
        },
        // Fix your allowed domains - these should be your API domain
        allowedDomains: ['localhost:7072'],  // Update with your actual API domain
        disallowedRoutes: ['localhost:7072/api/auth/login', 'localhost:7072/api/auth/register']
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
    ErrorService,
    // Fixed way to use provideAppInitializer
    provideAppInitializer(initializeAuth())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }