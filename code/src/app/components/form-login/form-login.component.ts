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
  serviceUser = inject(UserService);
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

    this.serviceUser.verificarCorreo(email).subscribe(
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
      const isPasswordValid = await this.verifyPassword(enteredPassword, usuario.password);

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

  // Método para verificar contraseñas desencriptando
  private async verifyPassword(enteredPassword: string, storedPassword: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const fixedKey = encoder.encode(environment.keyPass.padEnd(32, '0')).slice(0, 32);
    const storedBuffer = Uint8Array.from(atob(storedPassword), (c) => c.charCodeAt(0));

    const iv = storedBuffer.slice(0, 12); // Extrae el IV almacenado
    const encryptedData = storedBuffer.slice(12); // Datos encriptados almacenados

    try {
      const key = await crypto.subtle.importKey(
        'raw',
        fixedKey,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedData
      );

      const decodedPassword = new TextDecoder().decode(decryptedData);
      return decodedPassword === enteredPassword;
    } catch (error) {
      console.error('Error al desencriptar la contraseña:', error);
      throw new Error('Error al desencriptar');
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
