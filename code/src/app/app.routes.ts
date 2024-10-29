import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { FormLoginComponent } from './loginPage/form-login/form-login.component';
import { RegisterComponent } from './registerPage/form-register/form-register.component';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent
    },
    {
        path: 'login',
        component: FormLoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: '**', // el resto: AL FINAL POR FAVOR
        redirectTo: ''
    }
    
    
];
