import { Component, inject, OnInit } from '@angular/core';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { CurrentUser } from '../../../services/current-user.service';
import { UserService } from '../../../services/user.service';
import { Hotel } from '../../../interface/hotel.interface';
import { Flight } from '../../../interface/flight.interface';

@Component({
  selector: 'app-fetch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-flight-api.component.html',
  styleUrls: ['../new-service.css', './new-flight-api.component.css']
})
export class NewFlightApi implements OnInit {
  // Formulario para la búsqueda
  freemodeForm: FormGroup;

  // Servicios inyectados
  private apiService = inject(TripadvisorService);
  private currentUser = inject(CurrentUser); 
  private usersDB = inject(UserService);

  // Este usuario será el obj en en oninit
  usuarioActual : any;
  updatedUser : any; // Usuario actualizado
  travelName: string = ''; // Nombre del viaje

  // Propiedades del componente
  ciudadOrigen = '';
  ciudadDestino = '';
  fechaOrigen = '';
  fechaDestino = '';
  geoIdOrigen = 0;
  geoIdDestino = 0;

  // Este es el objeto que nos pasa el componente origen
  origen = history.state?.updatedUser ?? { services: [] };

  constructor(private formBuilder: FormBuilder) {
    // Definición del formulario
    this.freemodeForm = this.formBuilder.group({
      fechaOrigen: ['', Validators.required],
      fechaDestino: ['', Validators.required],
      ciudadOrigen: ['', Validators.required],
      ciudadDestino: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    
    // Acceder a la navegación
    // Le mandamos el obj usuario y el nombre del viaje creado (string)
    this.updatedUser = this.origen;
    this.travelName = history.state?.travelName ?? '';
  }
  
  // Fetch de la API
  onSubmit(): void {
    if (this.freemodeForm.get('ciudadOrigen')?.value && this.freemodeForm.get('ciudadDestino')?.value) {
     
      this.apiService.getHotelGeoId(this.freemodeForm.get('ciudadOrigen')?.value).subscribe({
        next: (data) => {
          this.geoIdOrigen = data.data[0].geoId;
          console.log(this.geoIdOrigen)  
        },
        error: (err) => {
          console.error('Error al obtener código de aeropuerto:', err);
          console.log(this.geoIdDestino)
        }
      });
    
      this.apiService.getHotelGeoId(this.freemodeForm.get('ciudadDestino')?.value).subscribe({
        next: (data) => {
          this.geoIdOrigen = data.data[0].geoId;
          console.log(this.geoIdOrigen)  
        },
          error: (err) => {
            console.error('Error al obtener código de aeropuerto:', err);
          }
      });
  }}

  agregarViaje(hotel : any) : void
  {  
    // Paso el hotel al formato de nuestra interface
    const hotelComoInterfaz = this.transformFlightData(hotel);

    // Accedo al objeto del nuevo viaje...
    // es: el usuario.travel.(resultado de búsqueda para el nombre que pasamos de origen como "travelName")
    const travelDetail = this.updatedUser.travel.find((travel: { name: string; }) => travel.name === this.travelName);
    
    // Guardo el servicio[] en una variable aparte (tiene referencia a la anterior)
    const arrServiceDetail = travelDetail.services;
    // (es el arr de servicios)


    // Guardo el nuevo hotel y tengo el arr listo
    arrServiceDetail.push(hotelComoInterfaz);

    // Como trabajamos por referencia desde el principio, queda guardado tamb en travel detail
    // Ahora sólo queda actualizarlo en el usuario, en usuarioActual tenemos el obj del usuario actual

    this.usersDB.updateUser(this.updatedUser).subscribe
    (
      {
        next: (res) => console.log(res),
        error: (err ) => console.log(err)
      }
    );
  }

  // Función que transforma los datos
  transformFlightData(flight: any): Flight {
    return {
      id: flight.id ? Number(flight.id) : 0, // Si no hay ID, asigna 0
      duration: flight.duration || 0, // Si no hay duración, asigna 0
      originAirportCode: flight.originAirportCode || '', // Código de aeropuerto de origen
      destinationAirportCode: flight.destinationAirportCode || '', // Código de aeropuerto de destino
      travelDate: flight.travelDate || '', // Fecha de viaje
      returnDate: flight.returnDate || '', // Fecha de retorno
      scale: flight.scale || 0, // Número de escalas
      class: flight.class || 'economy' // Clase del vuelo (por defecto, economy)
    };
  } 
}


