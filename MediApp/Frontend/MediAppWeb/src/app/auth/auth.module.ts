import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component'
import { SharedModule } from '../shared/shared.module';
@NgModule({
    imports: [
        SharedModule
    ],
    exports: [],
    declarations: [LoginComponent, RegisterComponent],
    providers: [],
})
export class AuthModule { }
