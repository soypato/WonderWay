import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = 'http://localhost:3000/users'; // Cambia esto a tu API

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
