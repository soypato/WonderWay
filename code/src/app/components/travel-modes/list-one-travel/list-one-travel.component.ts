import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../../../interface/restaurant.interface';
import { Hotel } from '../../../interface/hotel.interface';
import { Flight } from '../../../interface/flight.interface';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-list-one-travel',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './list-one-travel.component.html',
  styleUrls: ['./list-one-travel.component.css']
})

export class ListOneTravelComponent implements OnInit {
  travelData: any;
  serviceUser = inject(UserService); 
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Usar `history.state` para obtener el estado pasado por `router.navigate()`
    const travel = history.state?.travel;
    
    if (travel) {
      this.travelData = travel;
    }
  }

    // Comprobación de tipo para Restaurant
    isRestaurant(service: any): service is Restaurant {
      return service && service.phone !== undefined && service.location !== undefined;
    }
  
    // Comprobación de tipo para Hotel
    isHotel(service: any): service is Hotel {
      return service && service.price !== undefined && service.rooms !== undefined;
    }
  
    // Comprobación de tipo para Flight
    isFlight(service: any): service is Flight {
      return service && service.duration !== undefined && service.originAirportCode !== undefined;
    }
}
