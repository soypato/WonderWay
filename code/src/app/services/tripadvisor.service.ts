import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { tripkey } from "../../../../../tripkey";

@Injectable({
  providedIn: 'root',
})
export class TripadvisorService {
  private apiKey = tripkey.token;
  private baseUrl = 'https://api.content.tripadvisor.com/api/v1/location/search';
  private detailsUrl = 'https://api.content.tripadvisor.com/api/v1/location/details';
  private imageUrl = 'https://api.content.tripadvisor.com/api/v1/location/photos';
  private reviewsUrl = 'https://api.content.tripadvisor.com/api/v1/location/reviews';


  constructor(private http: HttpClient) {}

  /**
   * Busca ubicaciones (hoteles, atracciones, restaurantes o geos).
   * @param searchQuery Nombre o texto para buscar la ubicación.
   * @param category Categoría para filtrar los resultados. Opciones válidas: "hotels", "attractions", "restaurants", "geos".
   * @returns Observable con los resultados de la búsqueda.
   */
  searchLocations(searchQuery: string, category: string): Observable<any> {
    // La URL base ya está configurada, no es necesario agregarla aquí
    const url = this.baseUrl;
    
    // Encabezados
    const headers = new HttpHeaders({
      accept: 'application/json', // Asegura que la respuesta sea en JSON
    });

    // Parametros de la solicitud
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('searchQuery', searchQuery)
      .set('category', category)
      .set('language', 'es');

    // Realizamos la solicitud GET
    return this.http.get(url, { headers, params }).pipe(
      catchError((error) => {
        // Mejor manejo de errores
        console.error('Error al buscar ubicaciones:', error);
        return throwError(() => new Error('Error al buscar ubicaciones. Por favor, inténtalo de nuevo más tarde.'));
      })
    );
  }

  searchDetails(locationId: string): Observable<any> {
    const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details`;    
    console.log(this.detailsUrl);
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
  
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('locationId', locationId)
      .set('language', 'es');
  
    return this.http.get(url, { headers, params }).pipe(
      catchError((error) => {
        console.error('Error al buscar detalles de la ubicación:', error);
        return throwError(() => new Error('Error al buscar detalles de la ubicación. Por favor, inténtalo de nuevo más tarde.'));
      })
    );
  }
  
  searchImages(locationId: string): Observable<any> {
    const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos`;  
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
  
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('locationId', locationId)
      .set('language', 'es');
  
    return this.http.get(url, { headers, params }).pipe(
      catchError((error) => {
        console.error('Error al buscar imágenes de la ubicación:', error);
        return throwError(() => new Error('Error al buscar imágenes de la ubicación. Por favor, inténtalo de nuevo más tarde.'));
      })
    );
  }
  
  searchReviews(locationId: string): Observable<any> {
    const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/reviews`;  
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
  
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('locationId', locationId)
      .set('language', 'es');
  
    return this.http.get(url, { headers, params }).pipe(
      catchError((error) => {
        console.error('Error al buscar reseñas de la ubicación:', error);
        return throwError(() => new Error('Error al buscar reseñas de la ubicación. Por favor, inténtalo de nuevo más tarde.'));
      })
    );
  }
  
}
