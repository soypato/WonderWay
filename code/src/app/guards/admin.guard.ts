import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CurrentUser } from '../services/current-user.service';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private currentUserService = inject(CurrentUser);
  private userService = inject(UserService);
  private router = inject(Router);

  canActivate(): any {
    const userId = this.currentUserService.getUsuario() || '';

    if (!userId) {
      this.showAccessDenied();
      return new Observable((observer) => {
        observer.next(false);
        observer.complete();
      });
    }
    return this.userService.getUserProfile(userId).subscribe({
      next: (user) => {
        if (user.role === 'admin') {
          return true;
        } else {
          this.showAccessDenied();
          return false;
        }
      },
      error: (error) => {
        this.showAccessDenied();
        return false;
      }
    });
  }

  private showAccessDenied(): void {
    Swal.fire({
      title: 'Acceso denegado',
      text: 'No tienes permisos para acceder a esta sección.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    this.router.navigate(['/']); // Redirigir al home u otra ruta pública
  }
}
