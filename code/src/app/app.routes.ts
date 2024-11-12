import { Routes } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ModifyProfileComponent } from './modify-profile/modify-profile.component';
import { PublicGuard } from './guards/public.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent
    },
    {
        path: 'login',
        component: FormLoginComponent,
        canActivate: [PublicGuard]
    },
    {
        path: 'register',
        component: FormRegisterComponent,
        canActivate: [PublicGuard]
    },
    {
        path: 'about',
        component: AboutUsComponent
    },
    {
      path: 'profile', 
      component: ProfileComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'modifyprofile',
      component: ModifyProfileComponent
    },
    {
        path: '**', // el resto: AL FINAL POR FAVOR
        redirectTo: ''
    }


];
