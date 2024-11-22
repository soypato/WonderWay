import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { debounceTime, switchMap } from 'rxjs';
import { Travel } from '../../../interface/travel.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CurrentUser } from '../../../services/current-user.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interface/user.interface';

@Component({
  selector: 'app-new-travel',
  templateUrl: './new-travel.component.html',
  styleUrls: ['./new-travel.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class NewTravelComponent {
  travelForm: FormGroup;
  tripAdvisorService = inject(TripadvisorService);
  userCurrent = inject(CurrentUser);
  userService = inject(UserService);
  router = inject(Router);

  travelDetails: Travel = {
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    services: []
  };

  constructor(private fb: FormBuilder) {
    this.travelForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.travelForm.valid) {
      const { startDate, endDate } = this.travelForm.value;

      // Validación de rango de fechas
      if (new Date(endDate) <= new Date(startDate)) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'La fecha de fin debe ser posterior a la fecha de inicio.'
        });
        return;
      }

      try {
        // Crear un objeto de viaje con los datos del formulario
        this.travelDetails = {
          name: this.travelForm.value.name,
          location: this.travelForm.value.location,
          startDate: this.travelForm.value.startDate,
          endDate: this.travelForm.value.endDate,
          services: [] // Por ahora no tiene servicios
        };

        // Obtener el perfil del usuario
        this.userService.getUserProfile(this.userCurrent.getUsuario()).subscribe({
          next: (user) => {
            // Guardamos el viaje en el perfil del usuario
            this.saveToDB(user);
          },
          error: (err) => 
          {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Hubo un problema al guardar el viaje. Inténtalo nuevamente.'
            });
          }
        });

        // Mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Hemos guardado el progreso del viaje!'
        });

        // Redirigir a la lista de viajes
        this.router.navigate(['/menu_travel/travel_assistant/list_travels']);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Hubo un problema al guardar el viaje. Inténtalo nuevamente.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, completa todos los datos!'
      });
    }
  }

  private saveToDB(user: User) {
    // Confirmamos que se esté enviando el usuario actualizado
    if (user.travel) {
      // Agregar el nuevo viaje al array de viajes
      user.travel.push(this.travelDetails);
    } else {
      // Si no existe el array de viajes, lo creamos
      user.travel = [this.travelDetails];
    }

    // Actualizar el perfil del usuario en la base de datos
    this.userService.updateUser(user).subscribe({
      next: (updatedUser) => {
        // Redirigir al componente de viajes, pasando la información actualizada
        this.router.navigate(['/menu_travel/travel_assistant/list_travels']);
      },
      error: (err) => console.error('Error al actualizar el usuario en el servidor:', err)
    });
  }
}