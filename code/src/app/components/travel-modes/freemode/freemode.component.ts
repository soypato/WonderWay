import { HttpErrorResponse } from "@angular/common/http";
import { Inject, OnInit } from "@angular/core";
import { TripadvisorService } from "../../../services/tripadvisor.service";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

interface FlightData {
}

interface HotelData {
}

interface RestaurantData {
}

@Component({
  selector: 'app-example',
  templateUrl: './freemode.component.html',
  styleUrls: ['./freemode.component.css']
})
export class ExampleComponent implements OnInit {


  tripAdvisorService = Inject(TripadvisorService);
  flightsData: FlightData[] | undefined;
  hotelsData: HotelData[] | undefined;
  restaurantsData: RestaurantData[] | undefined;

  ngOnInit(): void {
      // Example call to search for flights
      this.tripAdvisorService.searchFlights('BOM', 'DEL').subscribe({
        next: (data: FlightData[]) => { 
          console.log('Flight Data:', data);
          this.flightsData = data;
        },
        error: (error: HttpErrorResponse) => {  // Using HttpErrorResponse
          console.error('Flight search error:', error.message);
        }
      });
    
      // Example call to search for hotels
      this.tripAdvisorService.searchHotels('mumbai').subscribe({
        next: (data: HotelData[]) => { 
          console.log('Hotel Data:', data);
          this.hotelsData = data;
        },
        error: (error: HttpErrorResponse) => {  // Using HttpErrorResponse
          console.error('Hotel search error:', error.message);
        }
      });
    
      // Example call to search for restaurants
      this.tripAdvisorService.searchRestaurants('mumbai').subscribe({
        next: (data: RestaurantData[]) => { 
          console.log('Restaurant Data:', data);
          this.restaurantsData = data;
        },
        error: (error: HttpErrorResponse) => {  // Using HttpErrorResponse
          console.error('Restaurant search error:', error.message);
        }
      });
  }
}
