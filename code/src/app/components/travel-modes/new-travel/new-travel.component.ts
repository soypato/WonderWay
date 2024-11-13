import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-travel',
  templateUrl: './new-travel.component.html',
  styleUrls: ['./new-travel.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class NewTravelComponent implements OnInit {
  travelForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.travelForm = this.fb.group({
      startDate: ['', Validators.required],
      location: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.travelForm.valid) {
      console.log('Form Submitted!', this.travelForm.value);
    }
  }
}