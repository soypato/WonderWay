import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripadvisorService {
  http: any;

  constructor() { }
  baseUrl = 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation';
  apiKey = environment.rapidApiKey;
  private headers = new HttpHeaders({
    'x-rapidapi-key': environment.rapidApiKey,
    'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com'
  });

   // Método para buscar vuelos
   searchFlights(source: string, destination: string): Observable<any> {
    const url = `${this.baseUrl}/flights/searchFlights?sourceAirportCode=${source}&destinationAirportCode=${destination}&itineraryType=ONE_WAY&sortOrder=ML_BEST_VALUE&numAdults=1&numSeniors=0&classOfService=ECONOMY&pageNumber=1&nearby=yes&nonstop=yes&currencyCode=USD&region=USA`;
    return this.http.get(url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para buscar hoteles
  searchHotels(query: string): Observable<any> {
    const url = `${this.baseUrl}/hotels/searchLocation?query=${query}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para buscar restaurantes
  searchRestaurants(query: string): Observable<any> {
    const url = `${this.baseUrl}/restaurant/searchLocation?query=${query}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error(error.message || 'Error en el servicio'));
  }


}
