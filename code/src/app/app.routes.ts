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
import { NewTravelComponent } from './components/travel-modes/new-travel/new-travel.component';
import { CrudNewTravelComponent } from './components/travel-modes/crud-new-travel/crud-new-travel.component';
import { ListTravelsComponent } from './components/travel-modes/list-travels/list-travels.component';
import { ListOneTravelComponent } from './components/travel-modes/list-one-travel/list-one-travel.component';
import { RestaurantApiComponent } from './components/travel-modes/restaurant-api/restaurant-api.component';
import { NewHotelApi } from './components/travel-modes/new-hotel-api/new-hotel-api.component';
import { NewFlightApi } from './components/travel-modes/new-flight-api/new-flight-api.component';

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
        path: 'menu_travel/free_mode',
        component: FreeMode,
        canActivate: [AuthGuard]
    },
    {
        path: 'menu_travel/travel_assistant',
        component: TravelassistantComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'new_travel',
        component: NewTravelComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'new_travel/crud-new-travel',
        component: CrudNewTravelComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'menu_travel/travel_assistant/list_travels',
        component: ListTravelsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'menu_travel/travel_assistant/list_travels/list_one_travel',
        component: ListOneTravelComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'new-hotel-api',
        component: NewHotelApi,
        canActivate: [AuthGuard]
    },
    {
        path: 'new-restaurant-api',
        component: RestaurantApiComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'new-flight-api',
        component: NewFlightApi,
        canActivate: [AuthGuard]
    },
    {
        path: '**', // el resto: AL FINAL POR FAVOR
        redirectTo: ''
    }


];
