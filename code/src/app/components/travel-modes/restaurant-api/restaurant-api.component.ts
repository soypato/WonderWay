import { Component, inject, OnInit } from '@angular/core';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentUser } from '../../../services/current-user.service';
import { UserService } from '../../../services/user.service';
import { Hotel } from '../../../interface/hotel.interface';
import { Restaurant } from '../../../interface/restaurant.interface';

@Component({
  selector: 'app-restaurant-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './restaurant-api.component.html',
  styleUrl: './restaurant-api.component.css'
})
export class RestaurantApiComponent implements OnInit {

  freemodeForm: FormGroup;
  private apiService = inject(TripadvisorService);
  private currentUser = inject(CurrentUser);
  private usersDB = inject(UserService);
  updatedUser: any;
  travelName: string = '';
  restaurantes: any;
  geoId: '' | undefined;

  origen = history.state?.updatedUser ?? { services: [] };

  constructor(private formBuilder: FormBuilder) {
    this.freemodeForm = this.formBuilder.group({
      ciudad: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.updatedUser = this.origen;
    this.travelName = history.state?.travelName ?? '';
    console.log(this.updatedUser);
    console.log(this.travelName);
  }

  onSubmit(): void {
    const ciudad = this.freemodeForm.get('ciudad')?.value;
  
    if (ciudad) {
      this.apiService.getRestaurantGeoId(ciudad).subscribe({
        next: (data) => {
          this.geoId = data.data[0].locationId || 0;
  
          if (this.geoId) {
            this.apiService.searchRestaurants(this.geoId).subscribe({
              next: (response) => {
                this.restaurantes = response.data?.data || [];
              },
              error: (err) => {
                console.error('Error al buscar restaurantes:', err);
              }
            });
          } else {
            console.warn('No se encontró GeoId para la ciudad:', ciudad);
          }
        },
        error: (err) => {
          console.error('Error al obtener GeoId:', err);
        }
      });
    } else {
      console.warn('Ciudad no especificada.');
    }
  }
  
  agregarViaje(restaurant: any): void {
    const restaurantComoInterfaz = this.transformRestaurantData(restaurant);

    const travelDetail = this.updatedUser.travel.find((travel: { name: string }) => travel.name === this.travelName);
    travelDetail.services.push(restaurantComoInterfaz);

    this.usersDB.updateUser(this.updatedUser).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err)
    });
  }

  transformRestaurantData(restaurant: any): any {
    return {
      id: restaurant.locationId,
      type: 'restaurant',
      name: restaurant.name || 'Sin nombre',
      location: restaurant.parentGeoName || 'Desconocido',
      price: restaurant.priceTag || 'N/A',
      qualification: restaurant.averageRating || 0,
      distance: restaurant.distanceTo || 'Desconocido',
      image: restaurant.squareImgUrl || '',
      review: restaurant.reviewSnippets?.[0]?.reviewText || 'Sin reseña disponible'
    };
  }
}
