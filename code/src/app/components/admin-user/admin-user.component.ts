import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interface/user.interface';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.css'
})
export class AdminUserComponent {
  userService = inject(UserService);
  users: User[] = []; // Lista de usuarios

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsersProfile().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la lista de usuarios.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  toggleBan(user: User | undefined): void {
    Swal.fire({
      title: '¿Confirmar?',
      text: '¿Estás seguro de que deseas eliminar a este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (user) {
        user.active = !user.active; // Marcar el usuario como inactivo
        this.userService.updateUser(user).subscribe({
          next: () => {
            Swal.fire('Hecho', 'El usuario fue modificado correctamente.', 'success');
            this.loadUsers(); // Recargar la lista de usuarios
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar al usuario.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
          complete: () => {
            this.loadUsers(); // Recargar la lista de usuarios
          },  
        });
      }
      else {
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    });
  }


  makeAdmin(user: User | undefined): void {
    Swal.fire({
      title: '¿Confirmar?',
      text: '¿Estás seguro de que deseas hacer administrador a este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, acepto',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (user) {
        user.role = 'admin'; // Marcar el usuario admin
        this.userService.updateUser(user).subscribe({
          next: () => {
            Swal.fire('Hecho', 'El usuario fue modificado correctamente.', 'success');
            this.loadUsers(); // Recargar la lista de usuarios
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo modificar al usuario.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
          complete: () => {
            this.loadUsers(); // Recargar la lista de usuarios
          },  
        });
      }
      else {
        Swal.fire('Error', 'No se pudo modificar el usuario.', 'error');
      }
    });
  }
}
