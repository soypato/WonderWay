import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = 'https://randomuser.me/api/'; // Cambia esto a tu API


  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    return this.http.get(this.apiUrl);
}


}
