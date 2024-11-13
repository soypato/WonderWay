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

        await this.addTravelToCurrentUser(this.travelDetails); // Espera a que el viaje se agregue al usuario actual
        await this.saveTravelToDatabase(this.userCurrent.getUsuario()); // Guarda en la base de datos

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

  private async addTravelToCurrentUser(travelData: Travel) {
    const currentUser = this.userCurrent.getUsuario();
    if (!currentUser.travel) {
      currentUser.travel = [];
    }
    currentUser.travel.push(travelData);
    console.log('Viaje agregado al usuario actual:', travelData);
  }

  private saveTravelToDatabase(user: any) {
    this.userService.updateUser(user).subscribe(
      (updatedUser) => {
        console.log('Usuario actualizado:', updatedUser);
        this.userCurrent.setUsuario(updatedUser);
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado correctamente en la base de datos'
        });
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'No se pudo actualizar el usuario en la base de datos. Por favor, intenta nuevamente.'
        });
      }
    );
  }
}
