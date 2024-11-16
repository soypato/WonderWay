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
  // Formulario para la búsqueda
  freemodeForm: FormGroup;

  // Servicios inyectados
  private apiService = inject(TripadvisorService);
  private currentUser = inject(CurrentUser); 
  private usersDB = inject(UserService);
  private router = inject(Router);

  usuarioActual : any;

  // Propiedades del componente
  ciudad = '';
  checkIn = '';
  checkOut = '';
  geoId = 0;
  updatedUser: any; // Usuario actualizado
  travelName: string = ''; // Nombre del viaje
  hoteles : any;
  
  // Estado de la navegación actual
  currentTravel = history.state?.updatedUser ?? { services: [] };

  constructor(private formBuilder: FormBuilder) {
    // Definición del formulario
    this.freemodeForm = this.formBuilder.group({
      ciudad: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Acceder a la navegación
    // Le mandamos el obj usuario y el nombre del viaje creado (string)
    this.updatedUser = this.currentTravel;
    this.travelName = this.currentTravel.travel ? this.currentTravel.travel[this.currentTravel.travel.length - 1]?.name : '';

    console.log(this.updatedUser)
    console.log(this.travelName)

    this.usersDB.getUserProfile(Number(this.currentUser.getUsuario())).subscribe
    (
      {
        next: (res) => {
          this.usuarioActual = res;
          console.warn(res);
        },
        error: (error) => {
          console.error(error);
        }
      }
    );
  }

  // Función que retorna los hoteles por defecto
  private getDefaultHotels() {
    return [
      {
        id: "25259297",
        title: "20. Hotel Casa Allegra Art Suites",
        primaryInfo: "Confort y arte en el corazón de la ciudad",
        secondaryInfo: "Ubicado en el centro de la ciudad, cerca de atracciones principales",
        badge: "Popular entre viajeros",
        bubbleRating: { count: "3", rating: 5 },
        provider: "Booking.com",
        priceForDisplay: "$48",
        cardPhotos: [
          { sizes: { maxHeight: 4032, maxWidth: 3024, urlTemplate: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/63/ea/d1/caption.jpg?w={width}&h={height}&s=1" } }
        ],
        commerceInfo: { externalUrl: "https://www.tripadvisor.in/Commerce?p=BookingCom&geo=25259297", provider: "Booking.com" }
      }
    ];
  }
  
  // ON SUBMIT PERFECTA
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

  agregarViaje(hotel : any) : void
  {  
    // Paso el hotel a una interfaz
    const hotelComoInterfaz = this.transformHotelData(hotel);

    // Accedo al objeto del nuevo viaje...
    // en la variable this.travelName almacené la string del objeto.nombre del nuevo viaje
    // accedo con ella, pero como es el nombre... implemento el find para la primer coincidencia
    // en travelDetail tenemos el objeto a modificar, es un pasaje por referencia, queda vinculado a updatedUser
    const travelDetail = this.updatedUser.travel.find((travel: { name: string; }) => travel.name === this.travelName);
    
    // Guardo el servicio[] en una variable aparte (tiene referencia a la anterior)
    const arrServiceDetail = travelDetail.services;
    
    // Guardo el nuevo hotel y tengo el arr listo
    arrServiceDetail.push(hotelComoInterfaz);

    // Como trabajamos por referencia desde el principio, queda guardado tamb en travel detail
    // Ahora sólo queda actualizarlo en el usuario, en usuarioActual tenemos el obj del usuario actual

    this.usersDB.updateUser(this.updatedUser).subscribe
    (
      {
        next: (res) => console.log(res),
        error: (err) => console.log(err)
      }
    );
  }

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


