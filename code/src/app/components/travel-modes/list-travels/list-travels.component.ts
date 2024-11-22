import { Component, inject, OnInit } from '@angular/core';
import { CurrentUser } from '../../../services/current-user.service';
import { Travel } from '../../../interface/travel.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interface/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-travels',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-travels.component.html',
  styleUrls: ['./list-travels.component.css']
})
export class ListTravelsComponent implements OnInit {
  currentUserId: string | null = inject(CurrentUser).getUsuario();
  serviceUser = inject(UserService); 
  serverUser: User | null = null;

  // El viaje actual (para cuando vaya al detail)
  currentTravel: Travel[] | null = null;

  // El viaje encontrado (para enviar a la ruta)
  findTravel: Travel | null = null;

  router = inject(Router);

  ngOnInit(): void {
    this.loadUserData();
    // Recargar la página para actualizar los datos
    this.loadUserData();

  }

  /**
   * Carga los datos del usuario y los viajes asociados.
   */
  private loadUserData(): void {
    if (this.currentUserId) {
      this.serviceUser.getUserProfile(this.currentUserId).subscribe({
        next: (res) => {
          this.serverUser = res;
          this.currentTravel = this.serverUser?.travel || []; // Asegura que sea un array vacío si no hay viajes
        },
        error: (err) => {
            console.error('Error al cargar el perfil del usuario:', err);
            Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al cargar el perfil del usuario. Por favor, inténtelo de nuevo más tarde.',
            });
        }
      });
    }
  }


  moreInfoTravel(name: string): void {
    this.findTravel = this.getTravelByName(name);
    
    if (this.findTravel) {
      this.router.navigate(['/menu_travel/travel_assistant/list_travels/list_one_travel'], {
        state: { travel: this.findTravel, user: this.serverUser }
      });
    } else {
      console.error('No se encontró el viaje con el nombre:', name);
    }
  }

  deleteTravel(name: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de eliminar el viaje: ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#013f4e',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const { index, travel } = this.mapTravel(name);
        if (index !== -1 && travel) {
          this.currentTravel?.splice(index, 1);
          this.updateInDB();
        } else {
          console.error('No se pudo eliminar el viaje: ', name);
        }
      }
    });
  }

    // Función principal para editar un viaje
    editTravel(name: string): void {
      const { index, travel } = this.mapTravel(name);
      if (index !== -1 && travel) {
        this.showEditTravelDialog(travel); // Llamar a la función modularizada
      } else {
        console.error('No se encontró el viaje:', name);
      }
    }
  
    // Mostrar el cuadro de diálogo para editar el viaje
    private showEditTravelDialog(travel: Travel): void {
      Swal.fire({
        title: 'Editar Viaje',
        html: this.generateEditFormHtml(travel),
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar cambios',
        confirmButtonColor: '#013f4e',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#b41c11',
        preConfirm: () => this.handleEditConfirm(travel),
      });
    }
    
    reload() : void
    {
      window.location.reload();
    }

    // Generar el HTML del formulario de edición
    private generateEditFormHtml(travel: Travel): string {
      return `
          <label for="name">Nombre del viaje:</label>
          <input id="name" class="swal2-input" placeholder="Nombre del viaje" value="${travel.name}">
          <br>
          <br>
          <label for="location">Ubicación:</label>
          <br>
          <input id="location" class="swal2-input" placeholder="Ubicación" value="${travel.location}">
          <br>
          <br>
          <label for="startDate">Fecha de inicio:</label>
          <br>
          <input id="startDate" class="swal2-input" placeholder="Fecha de inicio" value="${travel.startDate}">
          <br>
          <br>
          <label for="endDate">Fecha de fin:</label> <!-- Nueva línea para la fecha de fin -->
          <br>
          <input id="endDate" class="swal2-input" placeholder="Fecha de fin" value="${travel.endDate}">
      `;
    }
  
    // Manejar la confirmación del cuadro de diálogo
    private handleEditConfirm(travel: Travel): void {
      const nameInput = (document.getElementById('name') as HTMLInputElement).value;
      const locationInput = (document.getElementById('location') as HTMLInputElement).value;
      const startDateInput = (document.getElementById('startDate') as HTMLInputElement).value;
      const endDateInput = (document.getElementById('endDate') as HTMLInputElement).value; // Obtenemos la fecha de fin
    
      // Si no hubo cambios, se notifica al usuario y no se hace nada
      if (this.areFieldsUnchanged(travel, nameInput, locationInput, startDateInput, endDateInput)) {
        Swal.fire({
          icon: 'info',
          title: 'No se realizaron cambios',
          text: 'Los valores son los mismos que los actuales.',
        });
        return;
      }
    
      // Si hubo cambios, actualizamos el objeto `travel`
      travel.name = nameInput;
      travel.location = locationInput;
      travel.startDate = startDateInput;
      travel.endDate = endDateInput; // Actualizamos la fecha de fin
    
      // Llamamos a la función que actualiza el viaje en la base de datos
      this.updateInDB();
    }
  
    // Comprobar si los campos no fueron cambiados
    private areFieldsUnchanged(travel: Travel, nameInput: string, locationInput: string, startDateInput: string, endDateInput: string): boolean {
      return nameInput === travel.name && locationInput === travel.location && startDateInput === travel.startDate;
    }

  private getTravelByName(name: string): Travel | null {
    return this.currentTravel?.find((travel) => travel.name === name) || null;
  }

  private mapTravel(name: string): { index: number, travel: Travel | null } {
    const travel = this.getTravelByName(name);
    const index = travel ? this.currentTravel?.indexOf(travel) ?? -1 : -1;
    return { index, travel };
  }

  private updateInDB(): void {
    if (this.serverUser) {
      this.serviceUser.updateUser(this.serverUser).subscribe({
        next: (res) => {
          console.log('Usuario actualizado:', res);
        },
        error: (err) => {
          console.error('Error al actualizar el usuario:', err);
        }
      });
    }
  }
}
