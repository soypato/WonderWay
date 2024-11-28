import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { CurrentUser } from '../../../services/current-user.service';
import Swal from 'sweetalert2';
import { Award } from '../../../interface/restaurant.interface';

@Component({
  selector: 'app-new-restaurant-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-hotel-api.component.html',
  styleUrls: ['../new-service.css', './new-hotel-api.component.css'],
})
export class NewHotelApiComponent implements OnInit {
  searchForm: FormGroup;
  hotels: any[] = [];
  isLoading = false;
  errorMessage = '';
  tripAdvisorService = inject(TripadvisorService);
  selectedHotelDetails: any;
  selectedHotelImages: any[] = [];
  selectedHotelReviews: any[] = [];

  private currentUser = inject(CurrentUser);
  private usersDB = inject(UserService);


  // Este usuario será el obj en en oninit
  usuarioActual : any;
  updatedUser: any; // Usuario actualizado
  travelName: string = ''; // Nombre del viaje

  // Este es el objeto que nos pasa el componente origen
  origen = history.state?.updatedUser ?? { services: [] };

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchQuery: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {

    // Acceder a la navegación
    // Le mandamos el obj usuario y el nombre del viaje creado (string)
    this.updatedUser = this.origen;
    this.travelName = history.state?.travelName ?? '';

  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.hotels = [];

    const { searchQuery } = this.searchForm.value;
    

    this.tripAdvisorService.searchLocations(searchQuery, 'hotels').subscribe({
      next: (data) => {
        this.hotels = data.data; // Asignar los resultados a la variable restaurants
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron obtener los resultados de la búsqueda.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    });
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
      // (es el arr de servicios)


      // Guardo el nuevo hotel y tengo el arr listo
      arrServiceDetail.push(hotelComoInterfaz);


      // Mostrar SweetAlert
      Swal.fire({
        title: '¡Hotel agregado!',
        text: 'Ahora puedes agregar otros hoteles',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      // Como trabajamos por referencia desde el principio, queda guardado tamb en travel detail
      // Ahora sólo queda actualizarlo en el usuario, en usuarioActual tenemos el obj del usuario actual

      this.usersDB.updateUser(this.updatedUser).subscribe
      (
        {
          next: (res) => {},
          error: (err) => {}
        }
      );
    }


  transformHotelData(data: any) {
    return {
      location_id: data.location_id,
      type: 'hotel',
      name: data.name,
      address_obj: {
        street1: data.address_obj.street1,
        city: data.address_obj.city,
        country: data.address_obj.country,
        postalcode: data.address_obj.postalcode,
        address_string: data.address_obj.address_string,
      }
    };
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
      },
    });
  }
  
  
  

  verImagenes(locationId: string): void {
    // Llamamos al servicio para obtener las imágenes del restaurante
    this.tripAdvisorService.searchImages(locationId).subscribe({
      next: (data) => {
        this.selectedHotelImages = data.data; // Guardamos las imágenes obtenidas
  
        // Creamos el contenido HTML con el carrusel
        let imagesHtml = '<p>No hay imágenes disponibles.</p>';
  
        if (this.selectedHotelImages.length > 0) {
          let carouselItems = '';
          let indicators = '';
  
          this.selectedHotelImages.forEach((image: any, index: number) => {
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
          title: 'Imágenes del hotel',
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
        this.errorMessage = 'No se pudieron obtener las imágenes del hotel.';
      }
    });
  }

  // Función para obtener reseñas de un restaurante seleccionado y mostrarlas en un SweetAlert
  verOpiniones(locationId: string): void {
    this.tripAdvisorService.searchReviews(locationId).subscribe({
      next: (data) => {
  
        // Crear el contenido HTML para mostrar todas las reseñas
        let reviewsHtml = '';
        data.data.forEach((review: any) => {
          reviewsHtml += `
            <div style="margin-bottom: 20px;">
              <h5>${review.title}</h5>
              <p><strong>⭐ Calificación:</strong> <img src="${review.rating_image_url}" alt="Rating" /> (${review.rating} estrellas)</p>
              <p><strong>🙋 Usuario:</strong> ${review.user.username}</p>
              <p><strong>🖊️ Reseña:</strong> ${review.text}</p>
              <a href="${review.url}" class="button-main" target="_blank">Más información</a>
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
        this.errorMessage = 'No se pudieron obtener las reseñas del restaurante.';
      }
    });
  }
  

// Método para manejar el clic en un restaurante de la lista
onSelectHotel(locationId: string): void {
  this.verDetalles(locationId); // Obtener detalles
  this.verImagenes(locationId);  // Obtener imágenes
  this.verOpiniones(locationId); // Obtener reseñas
}

}
