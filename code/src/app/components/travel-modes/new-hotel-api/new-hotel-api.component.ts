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
  templateUrl: './new-hotel-api.component.html',
  styleUrls: ['../new-service.css', './new-hotel-api.component.css'],
})
export class NewHotelApiComponent implements OnInit {
  searchForm: FormGroup;
  hotels: any[] = [];
  isLoading = false;
  errorMessage = '';
  tripAdvisorService = inject(TripadvisorService);

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
    this.hotels = [];

    const { searchQuery } = this.searchForm.value;
    const hotelsJson = [
        {
            "location_id": "187514",
            "name": "Madrid",
            "address_obj": {
                "city": "Community of Madrid",
                "country": "Spain",
                "address_string": "Madrid Spain"
            }
        },
        {
            "location_id": "190146",
            "name": "Royal Palace of Madrid",
            "address_obj": {
                "street1": "Calle de Bailen s/n",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28071",
                "address_string": "Calle de Bailen s/n, 28071 Madrid Spain"
            }
        },
        {
            "location_id": "7309373",
            "name": "The Principal Madrid",
            "address_obj": {
                "street1": "Calle Marques De Valdeiglesias, 1",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28004",
                "address_string": "Calle Marques De Valdeiglesias, 1, 28004 Madrid Spain"
            }
        },
        {
            "location_id": "4719800",
            "name": "Only YOU Boutique Hotel Madrid",
            "address_obj": {
                "street1": "Calle del Barquillo 21",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28004",
                "address_string": "Calle del Barquillo 21, 28004 Madrid Spain"
            }
        },
        {
            "location_id": "11452855",
            "name": "Madrid Tapas and Wine Tasting Tour",
            "address_obj": {
                "city": "Madrid",
                "country": "Spain",
                "address_string": "Madrid Spain"
            }
        },
        {
            "location_id": "231633",
            "name": "ARTIEM Madrid",
            "address_obj": {
                "street1": "Calle Juan Perez Zuniga, 20",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28027",
                "address_string": "Calle Juan Perez Zuniga, 20, 28027 Madrid Spain"
            }
        },
        {
            "location_id": "8331763",
            "name": "Dear Hotel Madrid",
            "address_obj": {
                "street1": "Calle Gran Via 80",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28013",
                "address_string": "Calle Gran Via 80, 28013 Madrid Spain"
            }
        },
        {
            "location_id": "12877674",
            "name": "BLESS Hotel Madrid",
            "address_obj": {
                "street1": "Calle Velazquez 62",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28001",
                "address_string": "Calle Velazquez 62, 28001 Madrid Spain"
            }
        },
        {
            "location_id": "16658718",
            "name": "Pestana Plaza Mayor Madrid",
            "address_obj": {
                "street1": "Calle Imperial 8",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28012",
                "address_string": "Calle Imperial 8, 28012 Madrid Spain"
            }
        },
        {
            "location_id": "11464757",
            "name": "Madrid Highlights Bike Tour",
            "address_obj": {
                "city": "Madrid",
                "country": "Spain",
                "address_string": "Madrid Spain"
            }
        }
    ]

    this.hotels = hotelsJson;

    // this.tripAdvisorService.searchLocations(searchQuery, 'hotels').subscribe({
    //   next: (data) => {
    //     console.log(data)
    //     this.restaurants = data.data; // Asignar los resultados a la variable restaurants
    //   },
    //   error: (error) => {
    //     console.error('Error al buscar restaurantes:', error);
    //   }
    // });
  }

    agregarViaje(hotel : any) : void
    {
      // Paso el hotel al formato de nuestra interface
      const hotelComoInterfaz = this.transformHotelData(hotel);
      console.error(hotelComoInterfaz)

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
          error: (err) => console.log(err)
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

}
