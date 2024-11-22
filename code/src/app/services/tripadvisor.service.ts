import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { tripkey } from "../../../../../tripkey";

@Injectable({
  providedIn: 'root',
})
export class TripadvisorService {
  private readonly apiKey = tripkey.token;
  private readonly baseUrl = '/api/v1/location/search'; 

  constructor(private http: HttpClient) {}

  /**
   * Busca ubicaciones (hoteles, atracciones, restaurantes o geos).
   * @param searchQuery Nombre o texto para buscar la ubicación.
   * @param category Categoría para filtrar los resultados. Opciones válidas: "hotels", "attractions", "restaurants", "geos".
   * @returns Observable con los resultados de la búsqueda.
   */
  searchLocations(searchQuery: string, category: string): Observable<any> {
    const url = this.baseUrl; // Usamos la URL completa de la API
    const headers = new HttpHeaders({
      accept: 'application/json',
    });

    const params = {
      key: this.apiKey,
      searchQuery: searchQuery,
      category: category,
      language: 'es',
    };


    return this.http.get(url, { headers, params }).pipe(
      catchError((error) => {
        console.error('Error al buscar ubicaciones:', error);
        return throwError(() => new Error('Error al buscar ubicaciones. Por favor, inténtalo de nuevo más tarde.'));
      })
    );
  }
}
