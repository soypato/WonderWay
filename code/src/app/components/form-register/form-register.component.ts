import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, SweetAlert2Module] 
})
export class FormRegisterComponent implements OnInit {
  registerForm: FormGroup;
  userService = inject(UserService);
  router = inject(Router);

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: FormRegisterComponent.passwordMatchValidator });
  }

  ngOnInit(): void {}

  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulario válido:', this.registerForm.value);
      const email = this.registerForm.get('email')?.value;
  
      this.userService.verificarCorreo(email).subscribe(
        usuario => {
  
          // Si el usuario ya existe, muestra el alert
          if (usuario) {
            // alert('El usuario ya existe.');
            Swal.fire({
              title: 'Error!',
              text: 'El mail ingresado ya existe',
              icon: 'error',
              confirmButtonText: 'Reintentar'
            })
          } else {
            // Si no existe, crea un nuevo usuario con los datos del formulario
            const nuevoUsuario = {
              name: this.registerForm.get('nombre')?.value,
              email: email,
              password: this.registerForm.get('password')?.value,
              role: 'usuario',
              active: true
            };
  
            // Agregar el nuevo usuario
            this.userService.addUser(nuevoUsuario).subscribe({
              next: () => {
                // Redirigir a la página de inicio o donde sea necesario
                this.router.navigate(['/']);
              },
              error: (error) => console.log(error)
            });
          }
        },
        (error) => {
          console.log('Error al verificar correo:', error);
          alert('Error en la verificación del correo');
        }
      );
    } else {
      console.log('Formulario inválido');
      this.registerForm.markAllAsTouched();
    }
  }
}