import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { CurrentUser } from '../../../services/current-user.service';

@Component({
  selector: 'app-new-restaurant-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-restaurant-api.component.html',
  styleUrls: ['../new-service.css', './new-restaurant-api.component.css'],
})
export class NewRestaurantApiComponent implements OnInit {
  searchForm: FormGroup;
  restaurants: any[] = [];
  isLoading = false;
  errorMessage = '';
  tripAdvisorService = inject(TripadvisorService);
  selectedRestaurantDetails: any;
  selectedRestaurantImages: any[] = [];
  selectedRestaurantReviews: any[] = [];


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

    console.log(this.updatedUser);
    console.log(this.travelName);
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.restaurants = [];

    const { searchQuery } = this.searchForm.value;

    this.tripAdvisorService.searchLocations(searchQuery, 'restaurants').subscribe({
       next: (data) => {
         console.log(data)
         this.restaurants = data.data; // Asignar los resultados a la variable restaurants
       },
       error: (error) => {
         console.error('Error al buscar restaurantes:', error);
       }
    });
  }

    agregarViaje(restaurant : any) : void
    {
      // Paso el hotel al formato de nuestra interface
      const restaurantComoInterfaz = this.transformRestaurantData(restaurant);
      console.error(restaurantComoInterfaz)
      
      // Accedo al objeto del nuevo viaje...
      // es: el usuario.travel.(resultado de búsqueda para el nombre que pasamos de origen como "travelName")
      const travelDetail = this.updatedUser.travel.find((travel: { name: string; }) => travel.name === this.travelName);
  
      // Guardo el servicio[] en una variable aparte (tiene referencia a la anterior)
      const arrServiceDetail = travelDetail.services;
      // (es el arr de servicios)
  
  
      // Guardo el nuevo hotel y tengo el arr listo
      arrServiceDetail.push(restaurantComoInterfaz);
  
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

    transformRestaurantData(restaurant: any): any {
      return {
          name: restaurant.name || 'Sin nombre', // Nombre del restaurante
          type: 'restaurant',
          street: restaurant.address_obj?.street1 || 'Calle desconocida', // Calle principal
          city: restaurant.address_obj?.city  || 'Ciudad desconocida', // Ciudad
          country: restaurant.address_obj?.country  || 'País desconocido', // País
          postalCode: restaurant.address_obj?.postalcode || 'Sin código postal', // Código postal
      };
    }

    // Función para obtener detalles de un restaurante seleccionado
  verDetalles(locationId: string): void {
    console.log(locationId);
    this.tripAdvisorService.searchDetails(locationId).subscribe({
      next: (data) => {
        console.log('Detalles del restaurante:', data);
        this.selectedRestaurantDetails = data; // Guardar los detalles
      },
      error: (error) => {
        console.error('Error al buscar detalles del restaurante:', error);
        this.errorMessage = 'No se pudieron obtener los detalles del restaurante.';
      }
    });
  }

  // Función para obtener imágenes de un restaurante seleccionado
  verImagenes(locationId: string): void {
    this.tripAdvisorService.searchImages(locationId).subscribe({
      next: (data) => {
        console.log('Imágenes del restaurante:', data);
        this.selectedRestaurantImages = data.data; // Guardar las imágenes
      },
      error: (error) => {
        console.error('Error al buscar imágenes del restaurante:', error);
        this.errorMessage = 'No se pudieron obtener las imágenes del restaurante.';
      }
    });
  }

  // Función para obtener reseñas de un restaurante seleccionado
  verOpiniones(locationId: string): void {
    this.tripAdvisorService.searchReviews(locationId).subscribe({
      next: (data) => {
        console.log('Reseñas del restaurante:', data);
        this.selectedRestaurantReviews = data.data; // Guardar las reseñas
      },
      error: (error) => {
        console.error('Error al buscar reseñas del restaurante:', error);
        this.errorMessage = 'No se pudieron obtener las reseñas del restaurante.';
      }
    });
  }

  // Método para manejar el clic en un restaurante de la lista
  onSelectRestaurant(locationId: string): void {
    this.verDetalles(locationId); // Obtener detalles
    this.verImagenes(locationId);  // Obtener imágenes
    this.verOpiniones(locationId); // Obtener reseñas
  }
}


