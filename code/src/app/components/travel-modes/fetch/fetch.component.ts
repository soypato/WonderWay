import { Component, inject, OnInit } from '@angular/core';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-fetch',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './fetch.component.html',
  styleUrl: './fetch.component.css'
})
export class FetchComponent implements OnInit{

  apiService = inject(TripadvisorService);
  ciudad = 'Buenos Aires';
  geoId = 0;
  hoteles = [];


  // ngOnInit(){
  //   console.log(this.geoId);
  //   this.apiService.getHotelGeoId(this.ciudad).subscribe((data) => {
  //     this.geoId = data.geoId;
  //     console.log('aaaaa' + this.geoId);
  //     this.apiService.searchHotels(this.geoId).subscribe({
  //       next: (hotel) => {
  //         // this.hoteles = hotel;
  //         console.log(hotel);
  //       }  
  //     });
  //   });
  // }

  ngOnInit(): void {
    // Verifica primero si `ciudad` tiene un valor para evitar una llamada innecesaria.
    if (this.ciudad) {
      console.log('Buscando geoId para la ciudad:', this.ciudad);
  
      this.apiService.getHotelGeoId(this.ciudad).subscribe({
        next: (data) => {
          this.geoId = data.data[0].geoId;
          console.log('GeoId obtenido:', this.geoId);
          console.log(data);
          if (this.geoId) {
            this.apiService.searchHotels(this.geoId).subscribe({
              next: (hoteles) => {
                this.hoteles = hoteles; // Asigna los hoteles a la variable `hoteles`
                console.log('Hoteles obtenidos:', this.hoteles);
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
  
}