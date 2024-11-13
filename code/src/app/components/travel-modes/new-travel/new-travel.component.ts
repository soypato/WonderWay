import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { debounceTime, switchMap } from 'rxjs';
import { IService } from '../../../interface/service.interface';
import Swal from 'sweetalert2';

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
  service: IService = {
    location: '',
    startDate: ''
  };

  constructor(private fb: FormBuilder) {
    this.travelForm = this.fb.group({
      startDate: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.travelForm.valid) {
      this.service = 
      {
        location: this.travelForm.value.location,
        startDate: this.travelForm.value.startDate
      }
      this.travelForm.reset();
      Swal.fire({
        icon: 'success',
        title: '¡Hemos comenzado el viaje!'
      })
      
     }
     else
     {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor, completa los datos!',
        })
     }
  }
}