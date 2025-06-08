import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuard } from './auth/auth-guard.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { NotFoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    // Updated lazy loading syntax
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    // Updated to use functional guards instead of canLoad
    canActivate: [authGuard]
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  // Added the newer options for the router
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    // Remove initialNavigation: 'enabled' as it's deprecated
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }