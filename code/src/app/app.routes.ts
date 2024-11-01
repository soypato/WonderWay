import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ProfileComponent } from './components/profile/profile.component';


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
        component: AboutUsComponent
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
