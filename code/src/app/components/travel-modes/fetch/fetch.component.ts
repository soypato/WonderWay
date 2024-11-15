import { Component, inject, OnInit } from '@angular/core';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentUser } from '../../../services/current-user.service';
import { UserService } from '../../../services/user.service';
import { Hotel } from '../../../interface/hotel.interface';

@Component({
  selector: 'app-fetch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fetch.component.html',
  styleUrls: ['./fetch.component.css']
})
export class FetchComponent implements OnInit {
  freemodeForm: FormGroup;
  apiService = inject(TripadvisorService); // Inyección del servicio para consultar la API
  ciudad = '';
  checkIn = '';
  checkOut = '';
  geoId = 0;
  
  // Lista de hoteles por defecto
  // hoteles = [
  //   {
  //     id: "25259297",
  //     title: "20. Hotel Casa Allegra Art Suites",
  //     primaryInfo: "Confort y arte en el corazón de la ciudad",
  //     secondaryInfo: "Ubicado en el centro de la ciudad, cerca de atracciones principales",
  //     badge: "Popular entre viajeros",
  //     bubbleRating: { count: "3", rating: 5 },
  //     provider: "Booking.com",
  //     priceForDisplay: "$48",
  //     cardPhotos: [
  //       { sizes: { maxHeight: 4032, maxWidth: 3024, urlTemplate: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/63/ea/d1/caption.jpg?w={width}&h={height}&s=1" } }
  //     ],
  //     commerceInfo: { externalUrl: "https://www.tripadvisor.in/Commerce?p=BookingCom&geo=25259297", provider: "Booking.com" }
  //   }
  // ];


  hoteles: any[] = [];
  currentTravel = history.state?.currentTravel ?? { services: [] };
  currentUser = inject(CurrentUser);
  usersDB = inject(UserService);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.freemodeForm = this.formBuilder.group({
      ciudad: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required]
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
    if (this.freemodeForm.get('ciudad')?.value) {
      this.apiService.getHotelGeoId(this.freemodeForm.get('ciudad')?.value).subscribe({
        next: (data) => {
          this.geoId = data.data[0].geoId;
          if (this.geoId) {
            // Busca los hoteles en la ciudad usando el geoId
            this.apiService.searchHotels(this.geoId, this.freemodeForm.get('checkIn')?.value, this.freemodeForm.get('checkOut')?.value).subscribe({
              next: (hoteles) => {
                this.hoteles = hoteles.data.data;  // Actualiza la lista de hoteles con los datos recibidos
              },
              error: (err) => {
                console.error('Error al buscar hoteles:', err);
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
 
  agregarViaje(hotel: any): void {
    // Transforma los datos del hotel a la interfaz Hotel
    const transformedHotel: Hotel = this.transformHotelData(hotel);
  
    // Agrega el hotel transformado al arreglo de servicios del viaje
    this.currentTravel.services.push(transformedHotel);
  
    // Primero, obtiene el perfil del usuario para actualizarlo
    this.usersDB.getUserProfile(Number(this.currentUser.getUsuario())).subscribe({
      next: (user: any) => {
        // Encuentra el índice del viaje actual en el perfil del usuario
        const travelIndex = user.travel?.findIndex((travel: any) => travel.id === this.currentTravel.id);
  
        // Si el viaje existe, lo actualiza en el perfil del usuario
        if (travelIndex !== undefined && travelIndex !== -1 && user.travel) {
          // Aquí, solo actualizamos las propiedades del viaje necesarias
          const existingTravel = user.travel[travelIndex];
          existingTravel.services = this.currentTravel.services;  // Actualiza solo los servicios
          // No reemplazamos todo el objeto travel, solo la propiedad que queremos modificar
  
          // Ahora, guarda el perfil actualizado en la base de datos
          this.usersDB.updateUser(user).subscribe({
            next: (updateRes: any) => {
              console.log('Perfil de usuario actualizado:', updateRes);
            },
            error: (updateErr: any) => {
              console.error('Error al actualizar el perfil del usuario:', updateErr);
            }
          });
        } else {
          // Si el viaje no existe en el perfil, se agrega o manejar el caso
          console.warn('Viaje no encontrado en el perfil del usuario.');
        }
      },
      error: (err: any) => {
        console.error('Error al obtener perfil del usuario:', err);
      }
    });
  }
  
  
  // Función para transformar los datos del hotel a la interfaz Hotel
  transformHotelData(hotel: any): Hotel {
    return {
      id: hotel.id ? Number(hotel.id) : undefined,  // Si no tiene ID, lo pone como undefined
      name: hotel.title || '',  // Si no tiene título, lo pone como cadena vacía
      location: hotel.primaryInfo || '',  // Si no tiene información primaria, lo pone como cadena vacía
      price: hotel.priceForDisplay ? parseFloat(hotel.priceForDisplay.replace('$', '').replace(',', '')) : 0,  // Convierte el precio a número, si está disponible
      qualification: hotel.bubbleRating ? hotel.bubbleRating.rating : 0,  // Si no tiene calificación, lo pone como 0
      checkIn: hotel.checkIn ? Number(hotel.checkIn) : 0,  // Si no tiene checkIn, lo pone como 0
      checkOut: hotel.checkOut ? Number(hotel.checkOut) : 0,  // Si no tiene checkOut, lo pone como 0
      rooms: hotel.rooms ? Number(hotel.rooms) : 0  // Si no tiene información de habitaciones, lo pone como 0
    };
  }
  
  
}
