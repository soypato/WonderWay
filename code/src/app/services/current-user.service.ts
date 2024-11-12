import { Injectable } from '@angular/core';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrentUser {
  private usuarioActual: any = null;

  setUsuario(usuario: User): void {
    this.usuarioActual = usuario;
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
  }

  getUsuario(): User {
    return this.usuarioActual || JSON.parse(localStorage.getItem('usuarioActual') || 'null');
  }

  logout(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuarioActual');
  }
}
