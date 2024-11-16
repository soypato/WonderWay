import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CurrentUser } from '../services/current-user.service';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentUser = inject(CurrentUser); // Inyecta el servicio para obtener el usuario actual
  router = inject(Router);           // Inyecta el Router para redireccionar en caso necesario

  /**
   * Método que determina si un usuario puede acceder a la ruta protegida.
   * - Verifica si hay un `userId` activo a través del servicio `CurrentUser`.
   * - Si no hay `userId`, muestra una alerta y redirige al login.
   * - Si hay `userId`, permite el acceso a la ruta.
   */
  canActivate(): Observable<boolean> {
    const userId = this.currentUser.getUsuario(); // Obtiene el ID del usuario actual

    if (!userId) {
      // Si no hay usuario activo, muestra una alerta y redirige al login
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No se encontró un usuario válido. Por favor, inicia sesión.'
      });
      this.router.navigate(['/login']); // Redirige a la página de login
      return of(false); // Deniega el acceso
    }

    // Si hay un usuario activo, permite el acceso a la ruta
    return of(true); // Permite el acceso
  }
}

