import { Injectable } from '@angular/core';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrentUser {
  private usuarioActual: string | null = null;

  constructor() {
    // Inicializa usuarioActual con el valor almacenado en localStorage, si existe
    const storedUser = localStorage.getItem('usuarioActual');
    this.usuarioActual = storedUser ? JSON.parse(storedUser) : null;
  }

  setUsuario(id: string): void {
    this.usuarioActual = id !== undefined ? id : null;
    localStorage.setItem('usuarioActual', JSON.stringify(this.usuarioActual));
  }

  getUsuario(): string {
    // Intenta recuperar el usuarioActual del localStorage en caso de que esté vacío
    // porque si recarga sin login: se reinicia a null al no pasar por un getter
    if (this.usuarioActual === null) {
      const storedUser = localStorage.getItem('usuarioActual');
      this.usuarioActual = storedUser ? JSON.parse(storedUser) : null;
    }
    return this.usuarioActual || '';
  }

  logout(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuarioActual');
  }
}
