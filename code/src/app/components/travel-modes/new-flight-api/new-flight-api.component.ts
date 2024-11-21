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
  // ESTO HAY QUE SACARLO DE ACA

  iata = {
      "Albacete": "ABC",
      "Lanzarote": "ACE", 
      "Buenos Aires": "AEP",
      "San Rafael": "AFA",
      "Málaga": "AGP",
      "Alicante": "ALC",
      "Ámsterdam": "AMS",
      "Amarillo": "AMA",
      "Antofagasta": "ANF",
      "Paso de los Libres": "AOL", 
      "Arica": "ARI",
      "Estocolmo": "ARN",
      "Asunción": "ASU",
      "Atenas": "ATH",
      "Oranjestad": "AUA",
      "Balmaceda": "BBA",
      "Barcelona": "BCN",
      "Bahía Blanca": "BHI",
      "Bamiyán": "BIN",
      "Bilbao": "BIO",
      "Badajoz": "BJZ",
      "Burdeos": "BOD",
      "Bogotá": "BOG",
      "Bagram": "BPM",
      "San Carlos de Bariloche": "BRC",
      "Basilea": "BSL",
      "Lashkar Gah": "BST",
      "Budapest": "BUD",
      "Beja": "BYJ",
      "Córdoba": "COR",
      "Castellon": "CDT",
      "Cayo Coco": "CCC",
      "Concepción": "CCP",
      "Caracas": "CCS",
      "París": "CDG",
      "Colonia": "CGN",
      "Cali": "CLO",
      "Clorinda": "CLX",
      "Casablanca": "CMN",
      "Ciudad de Corrientes": "CNQ",
      "Concordia": "COC",
      "Ciudad Real": "CQM",
      "San Fernando del Valle de Catamarca": "CTC",
      "Cuenca": "CUE",
      "Chihuahua": "CUU",
      "Corvo": "CVU",
      "Curitiba": "CWB",
      "Dayton": "DAY",
      "Yerba": "DJE",
      "Moscú": "DME",
      "Doha": "DOH",
      "Dubái": "DXB",
      "Edimburgo": "EDI",
      "Eagle-Vail": "EGE",
      "Eindhoven": "EIN",
      "Área metropolitana de Buenos Aires": "EPA",
      "El Salvador": "ESR",
      "Ezeiza": "EZE",
      "Encarnacion": "ENO",
      "Medellín": "EOH",
      "Faro": "FAO",
      "Fayzabad": "FBD",
      "Roma": "FCO",
      "San Fernando": "FDO", 
      "Florencia": "FLR",
      "Flores": "FLW",
      "Formosa": "FMA",
      "Funchal": "FNC",
      "Fráncfort del Meno": "FRA",
      "Santa Elena de la Cruz": "FRS",
      "Fortaleza": "FOR",
      "El Calafate": "FTE",
      "Funafuti": "FUN",
      "Guadalajara": "GDL",
      "Gualeguaychú": "GHU",
      "Gibraltar": "GIB",
      "General Pico": "GPO",
      "São Paulo": "GRU",
      "Graciosa": "GRW",
      "Granada": "GRX",
      "Ciudad de Guatemala": "GUA",
      "Guayaquil": "GYE",
      "Hannover": "HAJ",
      "Hamburgo": "HAM", 
      "La Habana": "HAV",
      "Hubballi": "HBX",
      "Herat": "HEA",
      "Helsinki": "HEL",
      "Heligoland": "HGL",
      "Fráncfort": "HHN",
      "Honiara": "HIR",
      "Hong Kong": "HKG",
      "Hermosillo": "HMO",
      "Tokio": "HND",
      "Holguín": "HOG",
      "Horta": "HOR",
      "Honolulu": "HNL",
      "Houston": "HOU",
      "Huatulco": "HUX",
      "Ibiza": "IBZ",
      "Incheon": "ICN",
      "Puerto Iguazú": "IGR",
      "Inverness": "INV",
      "Isla de Pascua": "IPC",
      "Iquique": "IQQ",
      "Ciudad de La Rioja": "IRJ",
      "Estambul": "IST",
      "Ivalo": "IVL", 
      "Jalalabad": "JAA",
      "Saint Helier": "JER",
      "Nueva York": "JFK",
      "Pothia": "JKL",
      "Jessore": "JSR",
      "San Salvador de Jujuy": "JUJ",
      "Kabul": "KBL",
      "Kandahar": "KDH",
      "Reikiavik": "KEF",
      "Kaliningrado": "KGD",
      "Luanda": "LAD",
      "Las Vegas": "LAS",
      "Los Ángeles": "LAX",
      "La Ceiba": "LCE",
      "Almería": "LEI",
      "Seo de Urgel": "LEU",
      "Lieja": "LGG", 
      "Malargüe": "LGS",
      "Londres": "LGW",
      "Callao": "LIM",
      "Guanacaste": "LIR",
      "Lisboa": "LIS",
      "Ciudad de San Luis": "LUQ",
      "Madrid": "MAD",
      "Monte Caseros": "MCS", 
      "Rionegro": "MDE",
      "Mar del Plata": "MDQ",
      "Montevideo": "MVD", 
      "Ciudad de Mendoza": "MDZ",
      "Manta": "MEC",
      "Managua": "MGA",
      "Monterrey": "MTY",
      "Mercedes": "MDX",
      "Ciudad de Macao": "MFM",
      "Miami": "MIA",
      "Kansas City": "MKC", 
      "Melilla": "MLN",
      "Isla Soledad": "MPN",
      "Munich": "MUC",
      "Milán": "MXP", 
      "Mazar-e Sarif": "MZR",
      "Orlando": "MCO",
      "Nápoles": "NAP",
      "Nicosia": "NIC",
      "Ciudad de México": "NLU",
      "Kingston": "NLK",
      "Jasiko": "NRT", 
      "Oporto": "OPO",
      "San Ramón de la Nueva Orán": "ORA",
      "Chicago": "ORD",
      "Cork": "ORK",
      "Goya": "OYA", 
      "Puerto Barrios": "PBR", 
      "Maldonado y Punta del Este": "PDP",
      "Isla de São Miguel": "PDL", 
      "Filadelfia": "PHL", 
      "Isla del Pico": "PIX",
      "Pedro Juan Caballero": "PJC", 
      "Pamplona": "PNA", 
      "Paraná": "PRA",
      "Presidencia Roque Sáenz Peña": "PRQ", 
      "Puerto Argentino/Stanley": "PSY",
      "Ciudad de Panamá": "PTY", 
      "Punta Cana": "PUJ",
      "Punta Arenas": "PUQ", 
      "Isla de Porto Santo": "PXO",
      "Györ": "QGY",
      "Rancagua": "QRC",
      "Sabadell": "QSA",
      "Marrakech": "RAK",
      "Rabat": "RBA",
      "Ciudad de Resistencia": "RES",
      "Reus": "REU", 
      "Reynosa": "REX",
      "Río Grande": "RGA",
      "Termas de Río Hondo": "RHD",
      "Merlo": "RLO",
      "Región de Murcia": "RMU", 
      "Rosario": "ROS",
      "Rodrigues": "RRG",
      "Ciudad de Santa Rosa": "RSA",
      "Roatán": "RTB",
      "Riad": "RUH",
      "San Salvador": "SAL",
      "San Pedro Sula": "SAP",
      "Sibiu": "SBZ", 
      "Santiago de Cuba": "SCU",
      "Santiago de Chile": "SCL",
      "Ciudad de Santiago del Estero": "SDE", 
      "Santo Domingo": "SDQ",
      "Sacramento": "SFM",
      "Sauce Viejo": "SFN",
      "San Francisco": "SFO", 
      "Singapur": "SIN",
      "San José": "SJO", 
      "Isla de São Jorge": "SJZ", 
      "Tesalónica": "SKG",
      "Ciudad de Salta": "SLA",
      "Salamanca": "SLM",
      "Isla de Santa Maria": "SMA", 
      "Santa Clara": "SNU",
      "Lamezia Terme": "SUF", 
      "Sevilla": "SVQ",
      "Estrasburgo": "SXB", 
      "Sídney": "SYD",
      "Isla Terceira": "TER",
      "Teruel": "TEV", 
      "Tenerife": "TFS", 
      "Podgorica": "TGD",
      "Tegucigalpa": "TGU", 
      "Berlín": "THF",
      "Toulouse": "TLS", 
      "Tel Aviv": "TLV", 
      "Taipéi": "TPE", 
      "Trieste": "TRS", 
      "Astaná": "TSE", 
      "Tartagal": "TTG",
      "Túnez": "TUN", 
      "Turku": "TUR",
      "Tababela": "UIO", 
      "Ushuaia": "USH",
      "Curuzú Cuatiá": "UZU",
      "Sao Paulo": "VCP", 
      "Vitória da Conquista": "VDC", 
      "Viedma": "VDM", 
      "Viena": "VIE", 
      "Valencia": "VLC", 
      "Vigo": "VGO", 
      "Valladolid": "VLL",
      "Villa Mercedes": "VME",
      "Santa Cruz de la Sierra": "VVI", 
      "Wellington": "WLG",
      "Jerez": "XRY", 
      "Comayagua": "XPL",
      "Iqaluit": "YFB", 
      "Halifax": "YHZ", 
      "Ottawa": "YOW", 
      "Quebec": "YQB", 
      "Resolute": "YRB",
      "Montreal": "YUL", 
      "Qikiqtarjuaq": "YVM", 
      "Vancouver": "YVR", 
      "Winnipeg": "YWG", 
      "Mont-Joli": "YYY",
      "Toronto": "YYZ",
      "Zagreb": "ZAG",
      "Zaragoza": "ZAZ"
  
  }
  
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
  flights : any;

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
      ciudadOrigen: ['', Validators.required],
      ciudadDestino: ['', Validators.required],
      fechaOrigen: ['', Validators.required],
      fechaDestino: [''], // Opcional
      itineraryType: ['ONE_WAY', Validators.required],
      classOfService: ['ECONOMY', Validators.required],
      numAdults: [1, [Validators.required, Validators.min(1)]],
      numSeniors: [0, [Validators.min(0)]],
      sortOrder: ['PRICE']
    });
  }

  ngOnInit(): void {
    
    // Acceder a la navegación
    // Le mandamos el obj usuario y el nombre del viaje creado (string)
    this.updatedUser = this.origen;
    this.travelName = history.state?.travelName ?? '';
  }

  onSubmit(): void {
    // Obtenemos los valores del formulario
    const fechaOrigen = this.freemodeForm.get('fechaOrigen')?.value;
    const fechaDestino = this.freemodeForm.get('fechaDestino')?.value || '';
  
    // Convertir las fechas a formato 'YYYY-MM-DD'
    const fechaOrigenFormatted = this.formatDate(fechaOrigen);
    const fechaDestinoFormatted = fechaDestino ? this.formatDate(fechaDestino) : '';
  
    const params = {
      sourceAirportCode: '',  // Esto será llenado con los códigos de aeropuerto más adelante
      destinationAirportCode: '',
      date: fechaOrigenFormatted,
      returnDate: fechaDestinoFormatted,
      itineraryType: this.freemodeForm.get('itineraryType')?.value || 'ONE_WAY',
      classOfService: this.freemodeForm.get('classOfService')?.value || 'ECONOMY',
      numAdults: this.freemodeForm.get('numAdults')?.value || 1,
      numSeniors: this.freemodeForm.get('numSeniors')?.value || 0,
      sortOrder: 'PRICE'
    };
  
    // Validar si las ciudades y fechas están presentes
    if (this.freemodeForm.get('ciudadOrigen')?.value && this.freemodeForm.get('ciudadDestino')?.value && fechaOrigen) {
      const origenStringCiudad = this.freemodeForm.get('ciudadOrigen')?.value as keyof typeof this.iata;
      const destinoStringCiudad = this.freemodeForm.get('ciudadDestino')?.value as keyof typeof this.iata;
  
      params.sourceAirportCode= this.iata[origenStringCiudad];
      params.destinationAirportCode = this.iata[destinoStringCiudad];
      console.log(params);
      
        // Llamada a la API
        this.apiService.searchFlights(params).subscribe({
          next: (data) => {
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          }
        });
      
    }
  }
  
  // Función para convertir una fecha en formato 'YYYY-MM-DD'
  formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  agregarVuelo(hotel : any) : void
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


