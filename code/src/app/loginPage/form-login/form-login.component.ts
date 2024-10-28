import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-login',
  standalone: true,
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css'],
  imports: [ReactiveFormsModule]
})
export class FormLoginComponent implements OnInit {
  loginForm: FormGroup;

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
      // LOGICA DE LOGIN ACA
    } else {
      console.log('Formulario no válido');
    }
  }
}
