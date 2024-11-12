import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../interface/user.interface';


@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = 'http://localhost:3000/users'; // Cambia esto a tu API

  constructor(private http: HttpClient) {}

  getUsersProfile(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserProfile(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  verificarCorreo(correo: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${correo}`).pipe( // Filtro con el correo directamente en la URL
      map(usuarios => (usuarios.length > 0 ? usuarios[0] : null)), // Si existe, retornamos el primer usuario
      catchError(() => of(null)) // Si hay error, retornamos null
    );
  }

}
