import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  router = inject(Router);
  constructor(private route: ActivatedRoute) { }
  user: any;

  ngOnInit(): void {
    // Usar `history.state` para obtener el estado pasado por `router.navigate()`
    const travel = history.state?.travel;
    this.user = history.state?.user;
    
    if (travel) {
      this.travelData = travel;
    }
  }

  deleteService(service: any): void {
    const index = this.travelData.services.indexOf(service);
    if (index !== -1) {
      this.travelData.services.splice(index, 1);
    }
    console.log(this.user);

    // Actualizar el usuario
    this.serviceUser.updateUser(this.user).subscribe({
      next: (res) => {
        console.log('Usuario actualizado:', res);
      },
      error: (err) => {
        console.error('Error al actualizar el usuario:', err);
      }
    });
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

  addService(type : string) : void
  {
    switch(type)
    {
      case "hotel":
        this.router.navigate(['/new-hotel-api'], {
          state: {
            updatedUser: this.user,   // Pasa el usuario actualizado
            travelName: this.travelData.name // Y el nombre de la lista
          }
        });
        break;
    }
  }

}
