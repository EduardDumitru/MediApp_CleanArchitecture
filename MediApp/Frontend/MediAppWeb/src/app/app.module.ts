import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './pages/user/user.module';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { MiscellaneousModule } from './pages/miscellaneous/miscellaneous.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { SharedModule } from './shared/shared.module';
import { UIService } from './shared/ui.service';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
        whitelistedDomains: ['localhost:4200/login', 'localhost:4200/register']
      }
    }),
    UserModule,
    AuthModule,
    CoreModule.forRoot(),
    MiscellaneousModule,
    SharedModule
  ],
  providers: [AuthService, AuthGuardService, UIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
