import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../interface/user.interface';


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


  // Las contraseñas se guardan como hash PBKDF2-SHA256 con sal aleatoria:
  // "pbkdf2-sha256$iteraciones$sal$hash" (sal y hash en base64). No requiere ninguna clave.
  private static readonly HASH_SCHEME = 'pbkdf2-sha256';
  private static readonly HASH_ITERATIONS = 600_000;

  private bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
    return btoa(binary);
  }

  private base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  }

  private async deriveHash(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<Uint8Array> {
    const baseKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
      baseKey,
      256
    );

    return new Uint8Array(bits);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await this.deriveHash(password, salt, UserService.HASH_ITERATIONS);

    return [
      UserService.HASH_SCHEME,
      UserService.HASH_ITERATIONS,
      this.bytesToBase64(salt),
      this.bytesToBase64(hash),
    ].join('$');
  }

  async verifyPassword(enteredPassword: string, storedPassword: string): Promise<boolean> {
    const [scheme, iterations, salt, hash] = (storedPassword ?? '').split('$');
    if (scheme !== UserService.HASH_SCHEME || !iterations || !salt || !hash) {
      return false;
    }

    const derived = await this.deriveHash(enteredPassword, this.base64ToBytes(salt), Number(iterations));
    return this.bytesToBase64(derived) === hash;
  }

}
