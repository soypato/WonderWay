import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-register',
  standalone: true,
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css'],
  imports: [ReactiveFormsModule] 
})
export class FormRegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],                       // Control para el nombre
      email: ['', [Validators.required, Validators.email]],   //  para el correo electrónico
      password: ['', [Validators.required, Validators.minLength(6)]], //  para la contraseña
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulario de registro enviado', this.registerForm.value);
      // LOGICA PARA EL REGISTRO, QUE VAYA ACA
    } else {
      console.log('Formulario no válido');
    }
  }
}
