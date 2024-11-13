import { Routes } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ModifyProfileComponent } from './components/modify-profile/modify-profile.component';
import { PublicGuard } from './guards/public.guard';
import { AuthGuard } from './guards/auth.guard';
import { MenuTravel } from './components/travel-modes/menutravel/menutravel.component';
import { FreeMode } from './components/travel-modes/freemode/freemode.component';
import { TravelassistantComponent } from './components/travel-modes/travelassistant/travelassistant.component';

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
      component: ModifyProfileComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'menu_travel',
        component: MenuTravel,
        canActivate: [AuthGuard]
    },
    {
        path: 'freemode',
        component: FreeMode,
        canActivate: [AuthGuard]
    },
    {
        path: 'travel_assistant',
        component: TravelassistantComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**', // el resto: AL FINAL POR FAVOR
        redirectTo: ''
    }


];
