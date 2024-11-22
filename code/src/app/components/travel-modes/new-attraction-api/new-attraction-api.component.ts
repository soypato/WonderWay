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
  templateUrl: './new-attraction-api.component.html',
  styleUrls: ['../new-service.css', './new-attraction-api.component.css'],
})
export class NewAttractionApiComponent implements OnInit {
  searchForm: FormGroup;
  attractions: any[] = [];
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
    this.attractions = [];

    const { searchQuery } = this.searchForm.value;

    const attractionsJson = [
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
            "location_id": "286503",
            "name": "Parque Warner Madrid",
            "address_obj": {
                "street1": "Autovia A-4, Exit 22",
                "city": "San Martin de la Vega",
                "country": "Spain",
                "postalcode": "28330",
                "address_string": "Autovia A-4, Exit 22, 28330 San Martin de la Vega Spain"
            }
        },
        {
            "location_id": "7892146",
            "name": "Madrid Metro",
            "address_obj": {
                "city": "Madrid",
                "country": "Spain",
                "address_string": "Madrid Spain"
            }
        },
        {
            "location_id": "2592599",
            "name": "Hammam Al Andalus Madrid",
            "address_obj": {
                "street1": "C/ Atocha 14",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28012",
                "address_string": "C/ Atocha 14, 28012 Madrid Spain"
            }
        },
        {
            "location_id": "12288843",
            "name": "Free Walking Tours Madrid",
            "address_obj": {
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28013",
                "address_string": "28013 Madrid Spain"
            }
        },
        {
            "location_id": "2239279",
            "name": "Parque Madrid Rio",
            "address_obj": {
                "street1": "Paseo de la Ermita del Santo 14-16",
                "street2": "",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28011",
                "address_string": "Paseo de la Ermita del Santo 14-16, 28011 Madrid Spain"
            }
        },
        {
            "location_id": "2412546",
            "name": "Matadero Madrid",
            "address_obj": {
                "street1": "Plaza de Legazpi 8",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28045",
                "address_string": "Plaza de Legazpi 8, 28045 Madrid Spain"
            }
        },
        {
            "location_id": "1913235",
            "name": "SANDEMANs New Europe - Madrid",
            "address_obj": {
                "street1": "Plaza Mayor",
                "street2": "Paraguas rojo frente a la oficina de Turismo",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28012",
                "address_string": "Plaza Mayor Paraguas rojo frente a la oficina de Turismo, 28012 Madrid Spain"
            }
        },
        {
            "location_id": "1419410",
            "name": "IFEMA Convention Center - Feria de Madrid",
            "address_obj": {
                "street1": "",
                "street2": "",
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "",
                "address_string": "Madrid Spain"
            }
        },
        {
            "location_id": "13205212",
            "name": "Madrid Airport Transfers",
            "address_obj": {
                "city": "Madrid",
                "country": "Spain",
                "postalcode": "28001",
                "address_string": "28001 Madrid Spain"
            }
        }
    ]

    //this.attractions = attractionsJson;

    this.tripAdvisorService.searchLocations(searchQuery, 'attractions').subscribe({
      next: (data) => {
        console.log(data)
        this.attractions = data.data; // Asignar los resultados a la variable restaurants
      },
      error: (error) => {
        console.error('Error al buscar restaurantes:', error);
      }
    });
  }

    agregarViaje(attraction : any) : void
    {
      // Paso el hotel al formato de nuestra interface
      const atraccionComoInterfaz = this.transformAttractionData(attraction);
      console.error(atraccionComoInterfaz)
      
      // Accedo al objeto del nuevo viaje...
      // es: el usuario.travel.(resultado de búsqueda para el nombre que pasamos de origen como "travelName")
      const travelDetail = this.updatedUser.travel.find((travel: { name: string; }) => travel.name === this.travelName);
  
      // Guardo el servicio[] en una variable aparte (tiene referencia a la anterior)
      const arrServiceDetail = travelDetail.services;
      // (es el arr de servicios)
  
  
      // Guardo el nuevo hotel y tengo el arr listo
      arrServiceDetail.push(atraccionComoInterfaz);
  
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

    transformAttractionData(attraction: any) {
      return {
        location_id: attraction.location_id,
        type: 'attraction',
        name: attraction.name,
        address_obj: {
          street1: attraction.address_obj.street1,
          city: attraction.address_obj.city,
          country: attraction.address_obj.country,
          postalcode: attraction.address_obj.postalcode,
          address_string: attraction.address_obj.address_string,
        }
      };
    }
}
