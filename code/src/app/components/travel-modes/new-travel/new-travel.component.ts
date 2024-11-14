import { Component, inject, OnInit } from '@angular/core';
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
    services: []
  };

  constructor(private fb: FormBuilder) {
    this.travelForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.travelForm.valid) {
      try {
        this.travelDetails = {
          name: this.travelForm.value.name,
          location: this.travelForm.value.location,
          startDate: this.travelForm.value.startDate,
          services: []
        };

        this.userService.getUserProfile(Number(this.userCurrent.getUsuario())).subscribe({
          next: (user) => this.saveToDB(user),
          error: (err) => console.error('Error al obtener el perfil del usuario:', err)
        }); // Guarda en la base de datos

        this.travelForm.reset();
        Swal.fire({
          icon: 'success',
          title: '¡Hemos guardado el progreso del viaje!'
        });
      } catch (error) {
        console.error('Error al guardar el viaje:', error);
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
        text: 'Por favor, completa los datos!'
      });
    }
  }

private saveToDB(user: User) {
    // Confirmamos que se esté enviando el usuario actualizado
    console.log('Usuario a guardar en DB:', user);
    
    this.userService.updateUser(user).subscribe({
        next: (updatedUser) => {
            console.log('Usuario actualizado en el servidor:', updatedUser);
        },
        error: (err) => console.error('Error al actualizar el usuario en el servidor:', err)
    });
}


}
