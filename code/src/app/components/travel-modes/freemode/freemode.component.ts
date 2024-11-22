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
        console.error('Error al buscar:', error);
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
          title: 'Detalles',
          html: message,
          icon: 'info',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron obtener los detalles.',
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
        console.log('Imágenes:', data);
        this.selectedServiceImages = data.data; // Guardamos las imágenes obtenidas
  
        // Creamos el contenido HTML con el carrusel
        let imagesHtml = '<p>No hay imágenes disponibles.</p>';
  
        if (this.selectedServiceImages.length > 0) {
          let carouselItems = '';
          let indicators = '';
  
          this.selectedServiceImages.forEach((image: any, index: number) => {
            // Accedemos a la URL de la imagen más grande disponible
            const imageUrl = image.images?.original?.url || image.images?.large?.url || image.images?.medium?.url || image.images?.small?.url;
  
            // Aseguramos que la imagen tenga una URL válida
            if (!imageUrl) {
              return; // Si no hay URL, no mostramos esta imagen
            }
  
            // Verificamos si la imagen tiene una descripción
            const caption = image.caption || 'Sin descripción disponible'; // Si no tiene caption, mostramos un texto predeterminado
  
            // Crear cada item del carrusel
            carouselItems += `
              <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${imageUrl}" alt="${caption}" class="d-block w-100" style="height: 800px; object-fit: cover;">
                <div class="carousel-caption d-none d-md-block">
                  <p>${caption}</p>
                </div>
              </div>
            `;
  
            // Crear cada indicador
            indicators += `
              <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="true" aria-label="Slide ${index + 1}"></button>
            `;
          });
  
          imagesHtml = `
            <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-indicators">
                ${indicators}
              </div>
              <div class="carousel-inner">
                ${carouselItems}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          `;
        }
  
        // Mostrar SweetAlert con el carrusel de imágenes
        Swal.fire({
          title: 'Imágenes',
          html: imagesHtml,
          icon: 'info',
          confirmButtonText: 'Aceptar',
          width: '80%',
          heightAuto: true,
          didOpen: () => {
            // Aquí podemos cargar el script de Bootstrap para manejar el carrusel si no está cargado
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js';
            document.head.appendChild(script);
          }
        });
      },
      error: (error) => {
        console.error('Error al buscar imágenes:', error);
        this.errorMessage = 'No se pudieron obtener las imágenes.';
      }
    });
  }

  // Función para obtener reseñas de un restaurante seleccionado y mostrarlas en un SweetAlert
  verOpiniones(locationId: string): void {
    this.tripAdvisorService.searchReviews(locationId).subscribe({
      next: (data) => {
        console.log('Reseñas:', data);
  
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
          title: 'Reseñas',
          html: reviewsHtml,
          showCloseButton: true,
          showConfirmButton: false,
          width: '80%',
          heightAuto: true
        });
        
      },
      error: (error) => {
        console.error('Error al buscar reseñas:', error);
        this.errorMessage = 'No se pudieron obtener las reseñas.';
      }
    });
  }

}
