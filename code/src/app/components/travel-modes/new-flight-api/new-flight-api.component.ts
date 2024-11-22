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
  

  testData = {
      "status": true,
      "message": "Success",
      "timestamp": 1732166521575,
      "data": {
          "session": {
              "searchHash": "bf33399d40375a50061942e9db9a7044",
              "pageLoadUid": "c94b56e1-2dc1-47e8-8000-80b09c5b9bfa",
              "searchId": "039e2e7d-963b-4343-ae84-ccdcf555a462.96",
              "filterSettings": {
                  "aa": "",
                  "tt": "",
                  "a": "",
                  "d": "",
                  "ns": "1",
                  "cos": "0",
                  "fq": "",
                  "al": "",
                  "ft": "",
                  "sid": "",
                  "oc": "",
                  "plp": "",
                  "mc": "",
                  "da": "",
                  "pRange": "-1,-1",
                  "ca": ""
              }
          },
          "complete": true,
          "numOfFilters": 480,
          "totalNumResults": 589,
          "flights": [
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T22:35:00+01:00",
                                  "arrivalDateTime": "2024-11-28T23:50:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "VY",
                                  "operatingCarrierCode": "VY",
                                  "equipmentId": "Airbus A320 (sharklets)",
                                  "amenities": [],
                                  "flightNumber": 1009,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T06:10:00+01:00",
                                  "arrivalDateTime": "2024-12-04T07:30:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "UX",
                                  "operatingCarrierCode": "UX",
                                  "equipmentId": "Boeing 737-800 (winglets)",
                                  "amenities": [],
                                  "flightNumber": 7994,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|513",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 45.97,
                          "totalPricePerPassenger": 45.97,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 22.97,
                                  "totalPricePerPassenger": 22.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "CTRIPAIR",
                                      "displayName": "Trip.com",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/CTRIPAIR.png?crop=false&width=166&height=62&fallback=default1.png&_v=6ffbb6778ab7d3ee8da1e965010b225e"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 23,
                                  "totalPricePerPassenger": 23,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4686",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|513&area=FLTCenterColumn|1|1|ItinList|2|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4686&totalPricePerPassenger=45.97"
                      }
                  ],
                  "itineraryTag": {
                      "tag": "Cheapest",
                      "type": "CHEAPEST"
                  }
              },
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T22:35:00+01:00",
                                  "arrivalDateTime": "2024-11-28T23:50:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "VY",
                                  "operatingCarrierCode": "VY",
                                  "equipmentId": "Airbus A320 (sharklets)",
                                  "amenities": [],
                                  "flightNumber": 1009,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T11:50:00+01:00",
                                  "arrivalDateTime": "2024-12-04T13:20:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "UX",
                                  "operatingCarrierCode": "UX",
                                  "equipmentId": "Boeing 787-9 Dreamliner",
                                  "amenities": [],
                                  "flightNumber": 7706,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|816",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 45.97,
                          "totalPricePerPassenger": 45.97,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 22.97,
                                  "totalPricePerPassenger": 22.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "CTRIPAIR",
                                      "displayName": "Trip.com",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/CTRIPAIR.png?crop=false&width=166&height=62&fallback=default1.png&_v=6ffbb6778ab7d3ee8da1e965010b225e"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 23,
                                  "totalPricePerPassenger": 23,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4687",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|816&area=FLTCenterColumn|1|1|ItinList|3|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4687&totalPricePerPassenger=45.97"
                      }
                  ],
                  "itineraryTag": {
                      "tag": "Cheapest",
                      "type": "CHEAPEST"
                  }
              },
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T06:45:00+01:00",
                                  "arrivalDateTime": "2024-11-28T08:00:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "IB",
                                  "operatingCarrierCode": "IB",
                                  "equipmentId": "Airbus A320-100/200",
                                  "amenities": [],
                                  "flightNumber": 401,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T06:10:00+01:00",
                                  "arrivalDateTime": "2024-12-04T07:30:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "UX",
                                  "operatingCarrierCode": "UX",
                                  "equipmentId": "Boeing 737-800 (winglets)",
                                  "amenities": [],
                                  "flightNumber": 7994,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|438",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 56.97,
                          "totalPricePerPassenger": 56.97,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 33.97,
                                  "totalPricePerPassenger": 33.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "CTRIPAIR",
                                      "displayName": "Trip.com",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/CTRIPAIR.png?crop=false&width=166&height=62&fallback=default1.png&_v=6ffbb6778ab7d3ee8da1e965010b225e"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 23,
                                  "totalPricePerPassenger": 23,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4688",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|438&area=FLTCenterColumn|1|1|ItinList|4|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4688&totalPricePerPassenger=56.97"
                      }
                  ]
              },
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T10:30:00+01:00",
                                  "arrivalDateTime": "2024-11-28T11:45:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "IB",
                                  "operatingCarrierCode": "IB",
                                  "equipmentId": "Airbus A320 (sharklets)",
                                  "amenities": [],
                                  "flightNumber": 409,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T06:10:00+01:00",
                                  "arrivalDateTime": "2024-12-04T07:30:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "UX",
                                  "operatingCarrierCode": "UX",
                                  "equipmentId": "Boeing 737-800 (winglets)",
                                  "amenities": [],
                                  "flightNumber": 7994,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|72",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 58.97,
                          "totalPricePerPassenger": 58.97,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 35.97,
                                  "totalPricePerPassenger": 35.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "CTRIPAIR",
                                      "displayName": "Trip.com",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/CTRIPAIR.png?crop=false&width=166&height=62&fallback=default1.png&_v=6ffbb6778ab7d3ee8da1e965010b225e"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 23,
                                  "totalPricePerPassenger": 23,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4689",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|72&area=FLTCenterColumn|1|1|ItinList|6|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4689&totalPricePerPassenger=58.97"
                      }
                  ]
              },
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T13:15:00+01:00",
                                  "arrivalDateTime": "2024-11-28T14:30:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "IB",
                                  "operatingCarrierCode": "IB",
                                  "equipmentId": "Airbus A320-100/200",
                                  "amenities": [],
                                  "flightNumber": 413,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T06:10:00+01:00",
                                  "arrivalDateTime": "2024-12-04T07:30:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "UX",
                                  "operatingCarrierCode": "UX",
                                  "equipmentId": "Boeing 737-800 (winglets)",
                                  "amenities": [],
                                  "flightNumber": 7994,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|94",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 58.97,
                          "totalPricePerPassenger": 58.97,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 35.97,
                                  "totalPricePerPassenger": 35.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "CTRIPAIR",
                                      "displayName": "Trip.com",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/CTRIPAIR.png?crop=false&width=166&height=62&fallback=default1.png&_v=6ffbb6778ab7d3ee8da1e965010b225e"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 23,
                                  "totalPricePerPassenger": 23,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4690",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|94&area=FLTCenterColumn|1|1|ItinList|7|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4690&totalPricePerPassenger=58.97"
                      }
                  ]
              },
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T10:30:00+01:00",
                                  "arrivalDateTime": "2024-11-28T11:45:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "IB",
                                  "operatingCarrierCode": "IB",
                                  "equipmentId": "Airbus A320 (sharklets)",
                                  "amenities": [],
                                  "flightNumber": 409,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T11:50:00+01:00",
                                  "arrivalDateTime": "2024-12-04T13:20:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "UX",
                                  "operatingCarrierCode": "UX",
                                  "equipmentId": "Boeing 787-9 Dreamliner",
                                  "amenities": [],
                                  "flightNumber": 7706,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|753",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 58.97,
                          "totalPricePerPassenger": 58.97,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 35.97,
                                  "totalPricePerPassenger": 35.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "CTRIPAIR",
                                      "displayName": "Trip.com",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/CTRIPAIR.png?crop=false&width=166&height=62&fallback=default1.png&_v=6ffbb6778ab7d3ee8da1e965010b225e"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 23,
                                  "totalPricePerPassenger": 23,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4691",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|753&area=FLTCenterColumn|1|1|ItinList|8|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4691&totalPricePerPassenger=58.97"
                      }
                  ]
              },
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T13:15:00+01:00",
                                  "arrivalDateTime": "2024-11-28T14:30:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "IB",
                                  "operatingCarrierCode": "IB",
                                  "equipmentId": "Airbus A320-100/200",
                                  "amenities": [],
                                  "flightNumber": 413,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T11:50:00+01:00",
                                  "arrivalDateTime": "2024-12-04T13:20:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "UX",
                                  "operatingCarrierCode": "UX",
                                  "equipmentId": "Boeing 787-9 Dreamliner",
                                  "amenities": [],
                                  "flightNumber": 7706,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729002,
                                      "code": "UX",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/AirEuropa2.png",
                                      "displayName": "Air Europa"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|241",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 58.97,
                          "totalPricePerPassenger": 58.97,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 35.97,
                                  "totalPricePerPassenger": 35.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "CTRIPAIR",
                                      "displayName": "Trip.com",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/CTRIPAIR.png?crop=false&width=166&height=62&fallback=default1.png&_v=6ffbb6778ab7d3ee8da1e965010b225e"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 23,
                                  "totalPricePerPassenger": 23,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4692",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|241&area=FLTCenterColumn|1|1|ItinList|9|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4692&totalPricePerPassenger=58.97"
                      }
                  ]
              },
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T06:45:00+01:00",
                                  "arrivalDateTime": "2024-11-28T08:00:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "IB",
                                  "operatingCarrierCode": "IB",
                                  "equipmentId": "Airbus A320-100/200",
                                  "amenities": [],
                                  "flightNumber": 401,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T20:30:00+01:00",
                                  "arrivalDateTime": "2024-12-04T22:00:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "VY",
                                  "operatingCarrierCode": "VY",
                                  "equipmentId": "Airbus A319",
                                  "amenities": [],
                                  "flightNumber": 1008,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|100",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 59.31,
                          "totalPricePerPassenger": 59.31,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 33.97,
                                  "totalPricePerPassenger": 33.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "VY",
                                      "displayName": "Vueling",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/VY.png?crop=false&width=166&height=62&fallback=default2.png&_v=0583352b916cd4b8a65176f68b99c8a9"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 25.34,
                                  "totalPricePerPassenger": 25.34,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "fareBranding": {
                                      "brandId": "Economy",
                                      "carrierCode": "VY"
                                  },
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4693",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|100&area=FLTCenterColumn|1|1|ItinList|10|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4693&totalPricePerPassenger=59.31"
                      }
                  ]
              },
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T10:30:00+01:00",
                                  "arrivalDateTime": "2024-11-28T11:45:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "IB",
                                  "operatingCarrierCode": "IB",
                                  "equipmentId": "Airbus A320 (sharklets)",
                                  "amenities": [],
                                  "flightNumber": 409,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T20:30:00+01:00",
                                  "arrivalDateTime": "2024-12-04T22:00:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "VY",
                                  "operatingCarrierCode": "VY",
                                  "equipmentId": "Airbus A319",
                                  "amenities": [],
                                  "flightNumber": 1008,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|386",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 61.31,
                          "totalPricePerPassenger": 61.31,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 35.97,
                                  "totalPricePerPassenger": 35.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "VY",
                                      "displayName": "Vueling",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/VY.png?crop=false&width=166&height=62&fallback=default2.png&_v=0583352b916cd4b8a65176f68b99c8a9"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 25.34,
                                  "totalPricePerPassenger": 25.34,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "fareBranding": {
                                      "brandId": "Economy",
                                      "carrierCode": "VY"
                                  },
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4694",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|386&area=FLTCenterColumn|1|1|ItinList|12|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4694&totalPricePerPassenger=61.31"
                      }
                  ]
              },
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T13:15:00+01:00",
                                  "arrivalDateTime": "2024-11-28T14:30:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "IB",
                                  "operatingCarrierCode": "IB",
                                  "equipmentId": "Airbus A320-100/200",
                                  "amenities": [],
                                  "flightNumber": 413,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T20:30:00+01:00",
                                  "arrivalDateTime": "2024-12-04T22:00:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "VY",
                                  "operatingCarrierCode": "VY",
                                  "equipmentId": "Airbus A319",
                                  "amenities": [],
                                  "flightNumber": 1008,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|801",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 61.31,
                          "totalPricePerPassenger": 61.31,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 35.97,
                                  "totalPricePerPassenger": 35.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "VY",
                                      "displayName": "Vueling",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/VY.png?crop=false&width=166&height=62&fallback=default2.png&_v=0583352b916cd4b8a65176f68b99c8a9"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 25.34,
                                  "totalPricePerPassenger": 25.34,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "fareBranding": {
                                      "brandId": "Economy",
                                      "carrierCode": "VY"
                                  },
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4695",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|801&area=FLTCenterColumn|1|1|ItinList|13|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4695&totalPricePerPassenger=61.31"
                      }
                  ]
              },
              {
                  "segments": [
                      {
                          "legs": [
                              {
                                  "originStationCode": "MAD",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "BCN",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-11-28T06:45:00+01:00",
                                  "arrivalDateTime": "2024-11-28T08:00:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "IB",
                                  "operatingCarrierCode": "IB",
                                  "equipmentId": "Airbus A320-100/200",
                                  "amenities": [],
                                  "flightNumber": 401,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729089,
                                      "code": "IB",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Iberia.png",
                                      "displayName": "Iberia"
                                  }
                              }
                          ],
                          "layovers": []
                      },
                      {
                          "legs": [
                              {
                                  "originStationCode": "BCN",
                                  "isDifferentOriginStation": false,
                                  "destinationStationCode": "MAD",
                                  "isDifferentDestinationStation": false,
                                  "departureDateTime": "2024-12-04T15:55:00+01:00",
                                  "arrivalDateTime": "2024-12-04T17:15:00+01:00",
                                  "classOfService": "ECONOMY",
                                  "marketingCarrierCode": "VY",
                                  "operatingCarrierCode": "VY",
                                  "equipmentId": "Airbus A320 (sharklets)",
                                  "amenities": [],
                                  "flightNumber": 1006,
                                  "seatGuruEquipmentId": 0,
                                  "seatGuruAirlineUrl": "",
                                  "numStops": 0,
                                  "distanceInKM": 483.50418,
                                  "isInternational": false,
                                  "selfTransfer": false,
                                  "operatingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  },
                                  "marketingCarrier": {
                                      "locationId": 8729185,
                                      "code": "VY",
                                      "logoUrl": "https://static.tacdn.com/img2/flights/airlines/logos/100x100/Vueling.png",
                                      "displayName": "Vueling"
                                  }
                              }
                          ],
                          "layovers": []
                      }
                  ],
                  "purchaseLinks": [
                      {
                          "purchaseLinkId": "Kayak|1|197",
                          "providerId": "CombinedFare",
                          "commerceName": "KayakFlightsMeta_KayakFlightsMeta",
                          "currency": "USD",
                          "originalCurrency": "USD",
                          "seatAvailability": 0,
                          "taxesAndFees": 0,
                          "taxesAndFeesPerPassenger": 0,
                          "totalPrice": 63.550003,
                          "totalPricePerPassenger": 63.550003,
                          "fareBasisCodes": [],
                          "containedPurchaseLinks": [
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "EDREAMSAIR",
                                      "displayName": "eDreams",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/EDREAMSAIR.us.png?crop=false&width=166&height=62&fallback=default2.png&_v=af0479a857c0eb142b1531d305bbf971"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 33.97,
                                  "totalPricePerPassenger": 33.97,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              },
                              {
                                  "providerId": "Kayak",
                                  "partnerSuppliedProvider": {
                                      "id": "VY",
                                      "displayName": "Vueling",
                                      "logoUrl": "https://content.r9cdn.net/rimg/provider-logos/airlines/h/VY.png?crop=false&width=166&height=62&fallback=default2.png&_v=0583352b916cd4b8a65176f68b99c8a9"
                                  },
                                  "commerceName": "KayakFlightsMeta",
                                  "currency": "USD",
                                  "originalCurrency": "USD",
                                  "seatAvailability": 0,
                                  "taxesAndFees": 0,
                                  "taxesAndFeesPerPassenger": 0,
                                  "totalPrice": 29.58,
                                  "totalPricePerPassenger": 29.58,
                                  "fareBasisCodes": [],
                                  "containedPurchaseLinks": [],
                                  "fareBranding": {
                                      "brandId": "Economy",
                                      "carrierCode": "VY"
                                  },
                                  "partnerData": {},
                                  "isPaid": false,
                                  "fareAttributesList": []
                              }
                          ],
                          "impressionId": "b4761d2c-4500-483c-b6d2-19e391a52590.4696",
                          "partnerData": {},
                          "isPaid": false,
                          "fareAttributesList": [],
                          "url": "https://www.tripadvisor.com/CheapFlightsPartnerHandoff?searchHash=bf33399d40375a50061942e9db9a7044&provider=Kayak|1|197&area=FLTCenterColumn|1|1|ItinList|14|Meta_CombinedFarePrice&resultsServlet=CheapFlightsSearchResults&handoffPlatform=desktop&impressionId=b4761d2c-4500-483c-b6d2-19e391a52590.4696&totalPricePerPassenger=63.550003"
                      }
                  ]
              }
          ]
      }
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
//   ciudadOrigen = '';
//   ciudadDestino = '';
//   fechaOrigen = '';
//   fechaDestino = '';
//   geoIdOrigen = 0;
//   geoIdDestino = 0;
    origenCode = '';
    destinoCode = '';



  // Este es el objeto que nos pasa el componente origen
  origen = history.state?.updatedUser ?? { services: [] };

  constructor(private formBuilder: FormBuilder) {
    // Definición del formulario
    this.freemodeForm = this.formBuilder.group({
      ciudadOrigen: ['', Validators.required],
      ciudadDestino: ['', Validators.required],
      fechaOrigen: ['', Validators.required],
      fechaDestino: [''],
      itineraryType: ['ONE_WAY', Validators.required],
      classOfService: ['ECONOMY', Validators.required],
      numAdults: [1, [Validators.required, Validators.min(1)]],
      numSeniors: [0, Validators.min(0)],
      sortOrder: ['PRICE', Validators.required]
    });
  }

  ngOnInit(): void {
    
    // Acceder a la navegación
    // Le mandamos el obj usuario y el nombre del viaje creado (string)
    this.updatedUser = this.origen;
    this.travelName = history.state?.travelName ?? '';
  }

//   onSubmit(): void {
//     // Obtenemos los valores del formulario
//     const fechaOrigen = this.freemodeForm.get('fechaOrigen')?.value;
//     const fechaDestino = this.freemodeForm.get('fechaDestino')?.value || '';
  
//     // Convertir las fechas a formato 'YYYY-MM-DD'
//     const fechaOrigenFormatted = this.formatDate(fechaOrigen);
//     const fechaDestinoFormatted = fechaDestino ? this.formatDate(fechaDestino) : '';
  
//     const params = {
//       sourceAirportCode: '',  // Esto será llenado con los códigos de aeropuerto más adelante
//       destinationAirportCode: '',
//       date: fechaOrigenFormatted,
//       returnDate: fechaDestinoFormatted,
//       itineraryType: this.freemodeForm.get('itineraryType')?.value || 'ONE_WAY',
//       classOfService: this.freemodeForm.get('classOfService')?.value || 'ECONOMY',
//       numAdults: this.freemodeForm.get('numAdults')?.value || 1,
//       numSeniors: this.freemodeForm.get('numSeniors')?.value || 0,
//       sortOrder: 'PRICE'
//     };
  
//     // Validar si las ciudades y fechas están presentes
//     if (this.freemodeForm.get('ciudadOrigen')?.value && this.freemodeForm.get('ciudadDestino')?.value && fechaOrigen) {
//       const origenStringCiudad = this.freemodeForm.get('ciudadOrigen')?.value as keyof typeof this.iata;
//       const destinoStringCiudad = this.freemodeForm.get('ciudadDestino')?.value as keyof typeof this.iata;
  
//       params.sourceAirportCode= this.iata[origenStringCiudad];
//       params.destinationAirportCode = this.iata[destinoStringCiudad];
//       console.log(params);

//       this.flights = this.testData.data.flights;
//       console.log(this.flights)
      
//     }
//   }
  
//   // Función para convertir una fecha en formato 'YYYY-MM-DD'
//   formatDate(date: string): string {
//     const d = new Date(date);
//     const year = d.getFullYear();
//     const month = (d.getMonth() + 1).toString().padStart(2, '0');
//     const day = d.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   }

    // Buscar vuelos en la API
    onSubmit(): void {
        const params = {
          sourceAirportCode: '',
          destinationAirportCode: '',
          itineraryType: this.freemodeForm.get('itineraryType')?.value,
          sortOrder: this.freemodeForm.get('sortOrder')?.value,
          numAdults: this.freemodeForm.get('numAdults')?.value,
          numSeniors: this.freemodeForm.get('numSeniors')?.value,
          classOfService: this.freemodeForm.get('classOfService')?.value,
          date: this.freemodeForm.get('fechaOrigen')?.value,
          returnDate: this.freemodeForm.get('fechaDestino')?.value
        };
    
        // Obtener los códigos de aeropuerto para origen y destino
        const ciudadOrigen = this.freemodeForm.get('ciudadOrigen')?.value;
        const ciudadDestino = this.freemodeForm.get('ciudadDestino')?.value;
    
        if (ciudadOrigen && ciudadDestino) {
          this.apiService.getAirportCode(ciudadOrigen).subscribe({
            next: (dataOrigen) => {
              params.sourceAirportCode = dataOrigen.data[0].code;
              this.apiService.getAirportCode(ciudadDestino).subscribe({
                next: (dataDestino) => {
                  params.destinationAirportCode = dataDestino.data[0].code;
    
                  // Buscar vuelos usando los códigos obtenidos
                  this.apiService.searchFlights(params).subscribe({
                    next: (flights) => {
                      this.flights = flights.data;
                      console.log('Vuelos encontrados:', this.flights);
                    },
                    error: (err) => {
                      console.error('Error al buscar vuelos:', err);
                    }
                  });
                },
                error: (err) => {
                  console.error('Error al obtener código de aeropuerto destino:', err);
                }
              });
            },
            error: (err) => {
              console.error('Error al obtener código de aeropuerto origen:', err);
            }
          });
        } else {
          console.warn('Debe especificar tanto la ciudad de origen como la de destino.');
        }
      }

  agregarVuelo(vuelo : any) : void
  {  
    // Paso el hotel al formato de nuestra interface
    const hotelComoInterfaz = this.transformFlightData(vuelo);
    console.log(hotelComoInterfaz);

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

  // Función que transforma un solo vuelo
  transformFlightData(flight: any): Flight {
    const departureDate = flight.segments[0].legs[0].departureDateTime;
    const arrivalDate = flight.segments[0].legs[0].arrivalDateTime;
    const isInternational = flight.segments[0].legs[0].isInternational;
    const scale = flight.segments[0].legs[0].numStops;

    return {
      duration: this.calculateDuration(departureDate, arrivalDate),  // Duración en minutos
      type: 'flight',
      originAirportCode: flight.segments[0].legs[0].originStationCode,
      destinationAirportCode: flight.segments[0].legs[0].destinationStationCode,
      travelDate: departureDate,
      returnDate: arrivalDate,  // Fecha de regreso (mismo que llegada si no hay regreso separado)
      scale: scale || 0,  // Número de escalas
      class: flight.segments[0].legs[0].classOfService,
      flightNumber: flight.segments[0].legs[0].flightNumber,
      operatingCarrier: flight.segments[0].legs[0].operatingCarrier.displayName,
      marketingCarrier: flight.segments[0].legs[0].marketingCarrier.displayName,
      amenities: flight.segments[0].legs[0].amenities,
      isInternational: isInternational,
      purchaseLink: flight.purchaseLinks[0]?.url || '#',  // Si no existe enlace de compra, se coloca un marcador
    };
  }

  // Función para calcular la duración del vuelo en minutos
  calculateDuration(departureDateTime: string, arrivalDateTime: string): number {
    const departureTime = new Date(departureDateTime);
    const arrivalTime = new Date(arrivalDateTime);

    return (arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60);  // Duración en minutos
  }
}


