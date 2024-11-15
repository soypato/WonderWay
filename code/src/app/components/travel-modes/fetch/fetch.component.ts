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
    // Transforma el hotel recibido a la interfaz de Hotel
    const transformedHotel: Hotel = this.transformHotelData(hotel);
  
    // Verificamos si ya existe el array de servicios (services) en el viaje actual
    if (!this.currentTravel.services) {
      this.currentTravel.services = [];  // Si no existe, lo inicializamos
    }
  
    // Agregamos el hotel al array de servicios del viaje actual
    this.currentTravel.services.push(transformedHotel);
  
    // Luego, obtenemos el perfil del usuario para actualizarlo con los cambios
    this.usersDB.getUserProfile(Number(this.currentUser.getUsuario())).subscribe({
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
  
// Función para transformar los datos del hotel a la interfaz Hotel
transformHotelData(hotel: any): Hotel {
  return {
    id: hotel.id ? Number(hotel.id) : 0,  // Asignamos 0 en lugar de null si no tiene ID
    name: hotel.title || '',  // Asignamos una cadena vacía si no tiene título
    location: hotel.primaryInfo || '',  // Asignamos una cadena vacía si no tiene información primaria
    price: hotel.priceForDisplay ? parseFloat(hotel.priceForDisplay.replace('$', '').replace(',', '')) : 0,  // Asignamos 0 si no tiene precio
    qualification: hotel.bubbleRating ? hotel.bubbleRating.rating : 0,  // Asignamos 0 si no tiene calificación
    checkIn: hotel.checkIn ? Number(hotel.checkIn) : 0,  // Asignamos 0 si no tiene checkIn
    checkOut: hotel.checkOut ? Number(hotel.checkOut) : 0,  // Asignamos 0 si no tiene checkOut
    rooms: hotel.rooms ? Number(hotel.rooms) : 0  // Asignamos 0 si no tiene información de habitaciones
  };
}

  
}
