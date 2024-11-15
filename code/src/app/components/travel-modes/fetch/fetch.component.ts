import { Component, inject, OnInit } from '@angular/core';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Hotel } from '../../../interface/hotel.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fetch',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './fetch.component.html',
  styleUrl: './fetch.component.css'
})
export class FetchComponent{
  freemodeForm: FormGroup;
  apiService = inject(TripadvisorService);
  ciudad = '';
  checkIn = '';
  checkOut = '';
  geoId = 0;
  hoteles: any | undefined;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.freemodeForm = this.formBuilder.group({
      ciudad: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required]
    });
  }

  onSubmit(): void {
    // Verifica primero si `ciudad` tiene un valor para evitar una llamada innecesaria.
    if (this.freemodeForm.get('ciudad')?.value) {
      console.log('Buscando geoId para la ciudad:', this.freemodeForm.get('ciudad')?.value);
  
      this.apiService.getHotelGeoId(this.freemodeForm.get('ciudad')?.value).subscribe({
        next: (data) => {
          this.geoId = data.data[0].geoId;
          console.log('GeoId obtenido:', this.geoId);
          console.log(data);
          console.log(this.freemodeForm.get('checkIn')?.value);
          console.log(this.freemodeForm.get('checkOut')?.value);
          if (this.geoId) {
            this.apiService.searchHotels(this.geoId, this.freemodeForm.get('checkIn')?.value, this.freemodeForm.get('checkOut')?.value).subscribe({
              next: (hoteles) => {
                this.hoteles = hoteles.data.data; // Asigna los hoteles a la variable `hoteles`
                console.log('Hoteles obtenidos:', this.hoteles);
                console.log(hoteles);
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