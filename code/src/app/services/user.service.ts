import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../interface/user.interface';
import { environment } from '../../environments/environments';


@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsersProfile(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserProfile(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  deleteUser(id: string): Observable<User> {
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


  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
    return btoa(binary);
  }

  async encryptPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Ajusta la clave a una longitud válida (32 bytes para AES-256)
    const fixedKey = encoder.encode(environment.keyPass.padEnd(32, '0')).slice(0, 32);

    try {
      const key = await crypto.subtle.importKey(
        'raw',
        fixedKey,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      // Combina IV y datos encriptados en un solo ArrayBuffer
      const encryptedArray = new Uint8Array(encryptedData);
      const result = new Uint8Array(iv.length + encryptedArray.length);
      result.set(iv);
      result.set(encryptedArray, iv.length);

      return this.arrayBufferToBase64(result.buffer);
    } catch (error) {
      console.error('Error durante la encriptación:', error);
      throw new Error('Encriptación fallida');
    }
  }

  // Método para verificar contraseñas desencriptando
  async verifyPassword(enteredPassword: string, storedPassword: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const fixedKey = encoder.encode(environment.keyPass.padEnd(32, '0')).slice(0, 32);
    const storedBuffer = Uint8Array.from(atob(storedPassword), (c) => c.charCodeAt(0));

    const iv = storedBuffer.slice(0, 12); // Extrae el IV almacenado
    const encryptedData = storedBuffer.slice(12); // Datos encriptados almacenados

    try {
      const key = await crypto.subtle.importKey(
        'raw',
        fixedKey,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedData
      );

      const decodedPassword = new TextDecoder().decode(decryptedData);
      return decodedPassword === enteredPassword;
    } catch (error) {
      console.error('Error al desencriptar la contraseña:', error);
      throw new Error('Error al desencriptar');
    }
  }

}
