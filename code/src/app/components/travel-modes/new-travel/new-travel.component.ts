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

@Component({
  selector: 'app-new-travel',
  templateUrl: './new-travel.component.html',
  styleUrls: ['./new-travel.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class NewTravelComponent implements OnInit {
  travelForm: FormGroup;
  tripAdvisorService = inject(TripadvisorService);
  currentUserService = inject(CurrentUser);
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
  
  ngOnInit(): void {
  }

  onSubmit() {
    if (this.travelForm.valid) {
      console.log(this.travelForm.value);
      this.travelDetails = {
        name: this.travelForm.value.name,
        location: this.travelForm.value.location,
        startDate: this.travelForm.value.startDate,
        services: []
      };
      this.travelForm.reset();
      Swal.fire({
        icon: 'success',
        title: '¡Hemos guardado el progreso del viaje!'
      });
    } else {  
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, completa los datos!'
      });
    }
  }
}
