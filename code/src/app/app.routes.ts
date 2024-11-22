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
import { NewAttractionApiComponent } from './components/travel-modes/new-attraction-api/new-attraction-api.component';
import { NewHotelApiComponent } from './components/travel-modes/new-hotel-api/new-hotel-api.component';
import { NewRestaurantApiComponent } from './components/travel-modes/new-restaurant-api/new-restaurant-api.component';


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
        component: NewTravelComponent, // Ruta hacia el componente NewTravel
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
        path: 'new_attraction_api',
        component: NewAttractionApiComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'new_hotel_api',
        component: NewHotelApiComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'new_restaurant_api',
        component: NewRestaurantApiComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**', // el resto: AL FINAL POR FAVOR
        redirectTo: ''
    }
];