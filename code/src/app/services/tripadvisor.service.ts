import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { tripkey } from '../../../../../tripkey'

@Injectable({
  providedIn: 'root',
})
export class TripadvisorService {
  private readonly apiKey = tripkey.token;
  private readonly baseUrl = 'https://api.content.tripadvisor.com/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las fotos de una ubicación específica.
   * @param locationId ID de la ubicación.
   * @returns Observable con los datos de las fotos.
   */
  getLocationPhotos(locationId: string): Observable<any> {
    const url = `${this.baseUrl}/location/${locationId}/photos`;
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    return this.http.get(url, { headers, params: { language: 'en', key: this.apiKey } });
  }

  /**
   * Busca ubicaciones (hoteles, atracciones, restaurantes o geos).
   * @param searchQuery Nombre o texto para buscar la ubicación.
   * @param category Categoría para filtrar los resultados. Opciones válidas: "hotels", "attractions", "restaurants", "geos".
   * @returns Observable con los resultados de la búsqueda.
   */
  searchLocations(searchQuery: string, category: string): Observable<any> {
    const url = `${this.baseUrl}/location/search`;
    const headers = new HttpHeaders({
      accept: 'application/json',
    });
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('searchQuery', searchQuery)
      .set('category', category);

    return this.http.get(url, { headers, params }).pipe(
      catchError((error) => {
        console.error('Error al buscar ubicaciones:', error);
        throw error; // Puedes manejar el error de manera más personalizada si es necesario.
      })
    );
  }

  returnApiKey () : any
  {
    console.log(this.apiKey)
  }


}
