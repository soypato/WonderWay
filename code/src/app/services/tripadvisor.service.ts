import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TripadvisorService {
  http = inject(HttpClient);

constructor() { }
baseUrl = 'https://tripadvisor16.p.rapidapi.com/api/v1';
apiKey = environment.rapidApiKey;
private headers = new HttpHeaders({
  'x-rapidapi-key': environment.rapidApiKey,
  'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com'
});

  // Método para obtener códigos de aeropuerto
  getAirportCode(query: string): Observable<any> {
    const url = `${this.baseUrl}/flights/searchAirport?query=${query}`; 
    return this.http.get(url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener geoIds de hoteles
  getHotelGeoId(query: string): Observable<any> {
    const url = `${this.baseUrl}/hotels/searchLocation?query=${query}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para buscar hoteles
  searchHotels(query: number, checkIn: string, checkOut: string): Observable<any> {
    const url = `${this.baseUrl}/hotels/searchHotels?geoId=${query}&checkIn=${checkIn}&checkOut=${checkOut}&pageNumber=1&currencyCode=USD'`;
    console.log(url);
    return this.http.get(url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener geoIds de restaurantes
  getRestaurantGeoId(query: string): Observable<any> {
    const url = `${this.baseUrl}/restaurant/searchLocation?query=${query}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para buscar restaurantes
  searchRestaurants(query: number): Observable<any> {
    const url = `${this.baseUrl}/restaurant/searchRestaurants?locationId=${query}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }


searchFlights(params: {
  sourceAirportCode: string;
  destinationAirportCode: string;
  itineraryType: string;
  sortOrder: string;
  numAdults: number;
  numSeniors: number;
  classOfService: string;
  date?: string;
  returnDate?: string;
}): Observable<any> {
  let httpParams = new HttpParams()
    .set('sourceAirportCode', params.sourceAirportCode)
    .set('destinationAirportCode', params.destinationAirportCode)
    .set('itineraryType', params.itineraryType)
    .set('sortOrder', params.sortOrder)
    .set('numAdults', params.numAdults.toString())
    .set('numSeniors', params.numSeniors.toString())
    .set('classOfService', params.classOfService)
    .set('pageNumber', '1')
    .set('nearby', 'yes')
    .set('nonstop', 'yes')
    .set('currencyCode', 'USD')
    .set('region', 'USA');

  if (params.date) {
    httpParams = httpParams.set('date', params.date);
  }

  if (params.returnDate) {
    httpParams = httpParams.set('returnDate', params.returnDate);
  }

  const url = `${this.baseUrl}/flights/searchFlights`;
  return this.http.get(url, { params: httpParams, headers: this.headers }).pipe(
    catchError(this.handleError)
  );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }


}

