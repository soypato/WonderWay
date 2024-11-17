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
export class RestaurantApiComponent {
  freemodeForm: FormGroup;
  apiService = inject(TripadvisorService); // Inyección del servicio para consultar la API
  ciudad = '';
  geoId = 0;

  restaurants: any[] = [];
  currentTravel = history.state?.currentTravel ?? { services: [] };
  currentUser = inject(CurrentUser);
  usersDB = inject(UserService);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.freemodeForm = this.formBuilder.group({
      ciudad: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Verifica que la información de "currentTravel" esté disponible
    if (!this.currentTravel) {
      console.warn("No se encontró 'currentTravel' en el estado de la ruta. Redirigiendo...");
      this.router.navigate(['/ruta-default']);  // Redirige si no se encuentra
    }
  }

  onSubmit(): void {
    this.ciudad = this.freemodeForm.get('ciudad')?.value;
    if (this.ciudad) {
      console.log(this.ciudad);
      this.apiService.getRestaurantGeoId(this.ciudad).subscribe({
        next: (data) => {
          this.geoId = data.data[0].locationId;  // Obtiene el geoId de la ciudad
          if (this.geoId) {
            // Busca los hoteles en la ciudad usando el geoId
            this.apiService.searchRestaurants(this.geoId).subscribe({
              next: (restaurant) => {
                console.log(restaurant);
                this.restaurants = restaurant.data.data;  // Actualiza la lista de hoteles con los datos recibidos
              },
              error: (err) => {
                console.error('Error al buscar restaurantes:', err);
              }
            });
          } else {
            console.warn('GeoId no encontrado para la ciudad:', this.ciudad);
          }
        },
        error: (err) => {
          console.error('Error al obtener geoId:', err);
        }
      });
    } else {
      console.warn('Ciudad no especificada.');
    }
  }

  agregarViaje(restaurant: any): void {
    // Transforma el hotel recibido a la interfaz de Hotel
    const transformedRestaurant: Restaurant = this.transformRestaurantData(restaurant);
  
    // Verificamos si ya existe el array de servicios (services) en el viaje actual
    if (!this.currentTravel.services) {
      this.currentTravel.services = [];  // Si no existe, lo inicializamos
    }
  
    // Agregamos el hotel al array de servicios del viaje actual
    this.currentTravel.services.push(transformedRestaurant);
  
    // Luego, obtenemos el perfil del usuario para actualizarlo con los cambios
    this.usersDB.getUserProfile(this.currentUser.getUsuario()).subscribe({
      next: (user: any) => {
        // Aquí encontramos el índice del viaje en el array de viajes (travel) del usuario
        const travelIndex = user.travel?.findIndex((travel: any) => travel.id === this.currentTravel.id);
  
        // Si encontramos el índice (es decir, si el viaje existe en el perfil del usuario), lo actualizamos
        if (travelIndex !== undefined && travelIndex !== -1) {
          // Actualizamos solo los servicios del viaje sin borrar otros datos
          user.travel[travelIndex].services = this.currentTravel.services;
  
          // Ahora actualizamos el perfil del usuario en la base de datos
          this.usersDB.updateUser(user).subscribe({
            next: (updateRes: any) => {
              console.log('Perfil de usuario actualizado correctamente:', updateRes);
            },
            error: (updateErr: any) => {
              console.error('Error al actualizar el perfil del usuario:', updateErr);
            }
          });
        } else {
          // Si no encontramos el viaje en el perfil del usuario (lo cual no debería pasar), mostramos un mensaje
          console.warn('El viaje no fue encontrado en el perfil del usuario.');
        }
      },
      error: (err: any) => {
        console.error('Error al obtener el perfil del usuario:', err);
      }
    });
  }

  transformRestaurantData(restaurant: any): Restaurant {
    return {
      id: restaurant.restaurantsId ? Number(restaurant.restaurantsId) : 0,  // Asignamos 0 si no tiene ID
      name: restaurant.name || '',  // Asignamos cadena vacía si no tiene nombre
      location: restaurant.parentGeoName || '',  // Asignamos cadena vacía si no tiene ubicación
      qualification: restaurant.averageRating ? restaurant.averageRating : 0,  // Asignamos 0 si no tiene calificación
      reviewers: restaurant.userReviewCount ? restaurant.userReviewCount : 0,  // Asignamos 0 si no tiene críticas
      currentOpenStatusText: restaurant.currentOpenStatusText || 'Open now'  // Asignamos cadena vacía si no tiene estado actual
    };
  }
}
