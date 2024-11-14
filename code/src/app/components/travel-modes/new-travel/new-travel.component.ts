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

        this.addTravelToCurrentUser(this.travelDetails); // Espera a que el viaje se agregue al usuario actual
        this.saveToDB(this.userCurrent.getUsuario()); // Guarda en la base de datos

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
    // Clonamos el usuario actual para evitar problemas de referencia
    const currentUser = { ...this.userCurrent.getUsuario() };
    
    // Inicializar el arreglo 'travel' si no existe en el usuario actual
    if (!currentUser.travel) {
      currentUser.travel = [];
    }

    // Agregar el nuevo viaje al arreglo 'travel'
    currentUser.travel.push(travelData);
    console.log('Viaje agregado al usuario actual:', currentUser);

    // Actualizar el usuario en `CurrentUser`
    this.userCurrent.setUsuario(currentUser);
}

private saveToDB(user: User) {
    // Confirmamos que se esté enviando el usuario actualizado
    console.log('Usuario a guardar en DB:', user);
    
    this.userService.updateUser(user).subscribe({
        next: (updatedUser) => {
            console.log('Usuario actualizado en el servidor:', updatedUser);
            // Asegurarse de que el usuario retornado desde el servidor también tenga el arreglo actualizado
            this.userCurrent.setUsuario(updatedUser); // Si tienes un método para actualizar el usuario local
        },
        error: (err) => console.error('Error al actualizar el usuario en el servidor:', err)
    });
}


}
