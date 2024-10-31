import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { FormLoginComponent } from './loginPage/form-login/form-login.component';
import { FormRegisterComponent } from './registerPage/form-register/form-register.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ProfileComponent } from './profilePage/profile/profile.component';


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
        component: FormRegisterComponent
    },
    {
        path: 'about',
        component: ProfileComponent
    },
    {
        path: 'profile', 
        component: ProfileComponent
    },
    {
        path: '**', // el resto: AL FINAL POR FAVOR
        redirectTo: ''
    }
    
    
];
