import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { CurrentUser } from '../../../services/current-user.service';
import Swal from 'sweetalert2';
import { Award } from '../../../interface/restaurant.interface';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './freemode.component.html',
  styleUrls: ['../new-service.css','./freemode.component.css']
})
export class FreeMode{
  searchForm: FormGroup;
  services: any[] = [];
  isLoading = false;
  errorMessage = '';
  tripAdvisorService = inject(TripadvisorService);
  selectedServiceDetails: any;
  selectedServiceImages: any[] = [];
  selectedServiceReviews: any[] = [];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchQuery: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.services = [];

    const { searchQuery, categoria } = this.searchForm.value;
    console.log(categoria);
    console.log(searchQuery);

    this.tripAdvisorService.searchLocations(searchQuery, categoria).subscribe({
      next: (data) => {
        console.log(data)
        this.services = data.data; // Asignar los resultados a la variable restaurants
      },
      error: (error) => {
        console.error('Error al buscar restaurantes:', error);
      }
    });
  }

  verDetalles(locationId: string): void {
    this.tripAdvisorService.searchDetails(locationId).subscribe({
      next: (data) => {
        // Verificar si la descripción existe
        const description = data.description ? data.description.slice(0, 200) + '...' : 'Descripción no disponible';
  
        // Obtenemos los premios y sus imágenes
        const awards = data.awards || [];
        let awardImagesHtml = 'No tiene premios';
  
        if (awards.length > 0) {
          awardImagesHtml = ''; // Limpiamos el mensaje si existen premios
          awards.forEach((award: Award) => {
            if (award.images && award.images.small) {
              awardImagesHtml += `
                <div>
                  <img src="${award.images.small}" alt="Premio: ${award.display_name}" style="width: 50px; height: auto; margin-right: 10px;">
                  <strong>${award.display_name}</strong> (${award.year})
                </div>
              `;
            }
          });
        }
  
        const message = `
          <h4>${data.name}</h4>
          <p><strong>Descripción:</strong> ${description}</p>
          <p><strong>Ubicación:</strong> ${data.address_obj?.address_string}, ${data.address_obj?.city}</p>
          <p><strong>Ranking:</strong> ${data.ranking_data?.ranking_string}</p>
          <p><strong>Puntuación:</strong> ${data.rating} / 5</p>
          <p><strong>Reseñas:</strong> ${data.num_reviews}</p>
          <p><strong>Premios:</strong><br>${awardImagesHtml}</p>
        `;
  
        Swal.fire({
          title: 'Detalles del Hotel',
          html: message,
          icon: 'info',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron obtener los detalles del hotel.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        console.error('Error al buscar detalles:', error);
      },
    });
  }
  
  
  

  verImagenes(locationId: string): void {
    // Llamamos al servicio para obtener las imágenes del restaurante
    this.tripAdvisorService.searchImages(locationId).subscribe({
      next: (data) => {
        console.log('Imágenes del hotel:', data);
        this.selectedServiceImages = data.data; // Guardamos las imágenes obtenidas
  
        // Ahora mostramos las imágenes en un alert
        let imagesHtml = 'No hay imágenes disponibles';
  
        if (this.selectedServiceImages.length > 0) {
          imagesHtml = ''; // Limpiamos el mensaje si hay imágenes
          this.selectedServiceImages.forEach((image: any) => {
            const imageUrl = image.images?.small?.url || image.images?.medium?.url; // Usamos la imagen pequeña o mediana
            imagesHtml += `
              <div>
                <img src="${imageUrl}" alt="${image.caption}" style="width: 150px; height: auto; margin-right: 10px;">
                <strong>${image.caption}</strong> <em>(${image.album})</em>
              </div>
            `;
          });
        }
  
        // Mostrar el alert con las imágenes
        Swal.fire({
          title: 'Imágenes del Hotel',
          html: imagesHtml,
          icon: 'info',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (error) => {
        console.error('Error al buscar imágenes del restaurante:', error);
        this.errorMessage = 'No se pudieron obtener las imágenes del restaurante.';
      }
    });
  }

  // Función para obtener reseñas de un restaurante seleccionado y mostrarlas en un SweetAlert
  verOpiniones(locationId: string): void {
    this.tripAdvisorService.searchReviews(locationId).subscribe({
      next: (data) => {
        console.log('Reseñas del hotel:', data);
  
        // Crear el contenido HTML para mostrar todas las reseñas
        let reviewsHtml = '';
        data.data.forEach((review: any) => {
          reviewsHtml += `
            <div style="margin-bottom: 20px;">
              <h5>${review.title}</h5>
              <p><strong>Rating:</strong> <img src="${review.rating_image_url}" alt="Rating" /> (${review.rating} stars)</p>
              <p><strong>Review by:</strong> ${review.user.username}</p>
              <p><strong>Review:</strong> ${review.text}</p>
              <a href="${review.url}" target="_blank">Read more</a>
              <hr />
            </div>
          `;
        });
  
        // Mostrar SweetAlert con todas las reseñas
        Swal.fire({
          title: 'Reseñas del hotel',
          html: reviewsHtml,
          showCloseButton: true,
          showConfirmButton: false,
          width: '80%',
          heightAuto: true
        });
        
      },
      error: (error) => {
        console.error('Error al buscar reseñas del restaurante:', error);
        this.errorMessage = 'No se pudieron obtener las reseñas del restaurante.';
      }
    });
  }

}
