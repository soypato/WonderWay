import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { CurrentUser } from '../../services/current-user.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-form-login',
  standalone: true,
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class FormLoginComponent implements OnInit {
  loginForm: FormGroup;
  userService = inject(UserService);
  currentUser = inject(CurrentUser);
  router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      await this.verifyUser();
    } else {
      this.showError('Formulario no válido.');
    }
  }

  private async verifyUser(): Promise<void> {
    const email = this.loginForm.get('email')?.value;

    this.userService.verificarCorreo(email).subscribe(
      async (usuario) => {
        if (usuario) {
          await this.checkAttributes(usuario);
        } else {
          this.showError('Usuario no encontrado. Por favor, regístrese o ingrese nuevamente.');
        }
      },
      (error) => {
        console.error('Error al verificar usuario:', error);
        this.showError('Error al procesar la solicitud.');
      }
    );
  }

  private async checkAttributes(usuario: any): Promise<void> {
    try {
      const enteredPassword = this.loginForm.get('password')?.value;
      const isPasswordValid = await this.userService.verifyPassword(enteredPassword, usuario.password);

      if (isPasswordValid) {
        if (usuario.active) {
          this.currentUser.setUsuario(usuario.id);
          this.router.navigate(['/profile']);
        } else {
          this.showError('Este usuario está deshabilitado');
        }
      } else {
        this.showError('Contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error al verificar contraseña:', error);
      this.showError('No se pudo verificar la contraseña');
    }
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Reintentar',
    });
  }
}
