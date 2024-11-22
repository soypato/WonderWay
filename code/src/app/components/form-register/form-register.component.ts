import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, SweetAlert2Module],
})
export class FormRegisterComponent implements OnInit {
  registerForm: FormGroup;
  userService = inject(UserService);
  router = inject(Router);

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        email: ['', [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/)]  ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]  ],
      },
      // { validators: FormRegisterComponent.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    if (!crypto?.subtle) {
      console.error('El navegador no soporta Web Crypto API.');
      Swal.fire('Error', 'El navegador no soporta la funcionalidad requerida.', 'error');
    }
  }

  // static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  //   const password = control.get('password');
  //   const confirmPassword = control.get('confirmPassword');

  //   if (!password || !confirmPassword) {
  //     return null;
  //   }

  //   return password.value === confirmPassword.value ? { mismatch: false } : null;
  // }

  passwordMatchValidator(){
    const pass = this.registerForm.value.password;
    const confirm = this.registerForm.value.confirmPassword;

    if (  pass && confirm  ) {
      if( pass === confirm ){
        return true
      };
    }

    return false;
  }



  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      console.log('Formulario válido:', this.registerForm.value);
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;

      try {
        const encryptedPassword = await this.userService.encryptPassword(password);

        this.userService.verificarCorreo(email).subscribe(
          (usuario) => {
            if (usuario) {
              Swal.fire({
                title: 'Error!',
                text: 'El mail ingresado ya existe',
                icon: 'error',
                confirmButtonText: 'Reintentar',
              });
            } else {
              const nuevoUsuario = {
                name: this.registerForm.get('nombre')?.value,
                email: email,
                password: encryptedPassword,
                role: 'usuario',
                active: true,
                travel: []
              };

              this.userService.addUser(nuevoUsuario).subscribe({
                next: () => {
                  Swal.fire('Registro exitoso', '¡Bienvenido!', 'success');
                  this.router.navigate(['/']);
                },
                error: (error) => {
                  console.error('Error al registrar usuario:', error);
                  Swal.fire('Error', 'Hubo un problema en el registro', 'error');
                },
              });
            }
          },
          (error) => {
            console.error('Error al verificar correo:', error);
            Swal.fire('Error', 'Hubo un problema al verificar el correo', 'error');
          }
        );
      } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        Swal.fire('Error', 'No se pudo procesar la contraseña', 'error');
      }
    } else {
      this.registerForm.markAllAsTouched();
      Swal.fire('Formulario inválido', 'Revisa los campos ingresados', 'error');
    }
  }
}
