import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-form-login',
  standalone: true,
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css'],
  imports: [ReactiveFormsModule,CommonModule]
})
export class FormLoginComponent implements OnInit {
  loginForm: FormGroup;
  serviceUser = inject(UserService); 

  constructor(private fb: FormBuilder) {
     this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Control para el correo electrónico
      password: ['', [Validators.required]]                   // para la contraseña
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulario enviado', this.loginForm.value);
    } else {
      console.log('Formulario no válido');
    }
  }
}
