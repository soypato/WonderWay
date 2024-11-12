import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CurrentUser } from '../services/current-user.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(private currentUser: CurrentUser, private router: Router) {}

  canActivate(): boolean {
    const user = this.currentUser.getUsuario();
    if (!user) {
      return true; // Usuario no autenticado, permitir acceso a rutas públicas
    } else {
 
      Swal.fire({
        title: 'Error!',
        text: 'Ya hay iniciada una sesión',
        icon: 'error'
      })
      this.router.navigate(['/profile']); // Redirigir a profile si ya está autenticado
      return false;
    }
  }
}
