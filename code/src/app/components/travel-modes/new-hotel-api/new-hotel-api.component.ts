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
  templateUrl: './new-hotel-api.component.html',
  styleUrls: ['./new-hotel-api.component.css']
})
export class NewHotelApi implements OnInit {
  // Formulario para la búsqueda
  freemodeForm: FormGroup;

  // Servicios inyectados
  private apiService = inject(TripadvisorService);
  private currentUser = inject(CurrentUser); 
  private usersDB = inject(UserService);

  // Este usuario será el obj en en oninit
  usuarioActual : any;

  // Propiedades del componente
  ciudad = '';
  checkIn = '';
  checkOut = '';
  geoId = 0;
  updatedUser: any; // Usuario actualizado
  travelName: string = ''; // Nombre del viaje
  hoteles : any;

  // Este es el objeto que nos pasa el componente origen
  origen = history.state?.updatedUser ?? { services: [] };

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
    this.updatedUser = this.origen;
    this.travelName = history.state?.travelName ?? '';
  
    console.log(this.updatedUser);
    console.log(this.travelName);
  }
  
  // Fetch de la API
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
    // Paso el hotel al formato de nuestra interface
    const hotelComoInterfaz = this.transformHotelData(hotel);

    // Accedo al objeto del nuevo viaje...
    // es: el usuario.travel.(resultado de búsqueda para el nombre que pasamos de origen como "travelName")
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


