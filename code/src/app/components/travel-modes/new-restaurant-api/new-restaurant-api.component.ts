import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripadvisorService } from '../../../services/tripadvisor.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-restaurant-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-restaurant-api.component.html',
  styleUrls: ['../new-service.css', './new-restaurant-api.component.css'],
})
export class NewRestaurantApiComponent {
  searchForm: FormGroup;
  restaurants: any[] = [];
  isLoading = false;
  errorMessage = '';
  tripAdvisorService = inject(TripadvisorService);

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchQuery: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.restaurants = [];

    const { searchQuery } = this.searchForm.value;

    this.tripAdvisorService.searchLocations(searchQuery, 'restaurants').subscribe({
      next: (data) => {
        console.log(data)
        this.restaurants = data.results; // Asignar los resultados a la variable restaurants
      },
      error: (error) => {
        console.error('Error al buscar restaurantes:', error);
      }
    });



  }
}
