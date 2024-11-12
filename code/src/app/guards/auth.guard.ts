import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CurrentUser } from '../services/current-user.service';
import Swal from 'sweetalert2';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentUser = inject(CurrentUser);
  router = inject(Router);

  canActivate(): boolean {
    const user: User | null = this.currentUser.getUsuario(); // Obtiene el usuario actual directamente

    if (user) {
      return true; // Usuario autenticado, permitir acceso a /profile
    } else {
       
      Swal.fire({
        title: 'Error!',
        text: 'Para visualizar esta información, primero debes iniciar sesión o registrarte',
        icon: 'error'
      })
      this.router.navigate(['/login']); // Redirigir al login si no está autenticado
      return false;
    }
  }
}
