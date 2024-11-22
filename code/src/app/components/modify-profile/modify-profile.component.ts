import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CurrentUser } from '../../services/current-user.service';
import { User } from '../../interface/user.interface';
import { environment } from '../../../environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modify-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modify-profile.component.html',
  styleUrls: ['./modify-profile.component.css'],
})
export class ModifyProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  currentUser: User | null = null;
  userid: string | null = null;

  userService = inject(UserService)
  currentUserService = inject(CurrentUser)

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: [''],
      email: [
        '',
        [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/)],
      ],
      currentPassword: ['', [Validators.required]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });

    this.userid = this.currentUserService.getUsuario();

    if (this.userid) {
      this.userService.getUserProfile(this.userid).subscribe({
        next: (user: User) => {
          this.currentUser = user;
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar el perfil del usuario. Intente nuevamente.',
          });
        },
      });
    }
  }

  // Verificar contraseñas desencriptadas
  async verifyPassword(enteredPassword: string, storedPassword: string): Promise<boolean> {
    if (!storedPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña almacenada no es válida.',
      });
      return false;
    }

    const encoder = new TextEncoder();
    const fixedKey = encoder.encode(environment.keyPass.padEnd(32, '0')).slice(0, 32);
    const storedBuffer = Uint8Array.from(atob(storedPassword), (c) => c.charCodeAt(0));
    const iv = storedBuffer.slice(0, 12);
    const encryptedData = storedBuffer.slice(12);

    try {
      const key = await crypto.subtle.importKey('raw', fixedKey, { name: 'AES-GCM' }, false, ['decrypt']);
      const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);
      const decodedPassword = new TextDecoder().decode(decryptedData);
      return decodedPassword === enteredPassword;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al verificar la contraseña actual.',
      });
      return false;
    }
  }

  // Encriptar contraseñas
  async encryptPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const fixedKey = encoder.encode(environment.keyPass.padEnd(32, '0')).slice(0, 32);

    try {
      const key = await crypto.subtle.importKey('raw', fixedKey, { name: 'AES-GCM' }, false, ['encrypt']);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
      const result = new Uint8Array(iv.length + encryptedData.byteLength);
      result.set(iv);
      result.set(new Uint8Array(encryptedData), iv.length);
      return btoa(String.fromCharCode(...result));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al encriptar la contraseña.',
      });
      throw error;
    }
  }

  // Verificar coincidencia entre contraseñas
  passwordsMatch(): boolean {
    const { newPassword, confirmPassword } = this.passwordForm.value;
    return newPassword === confirmPassword;
  }

  async onProfileSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      const passwordValid = await this.verifyPassword(
        this.profileForm.value.currentPassword,
        this.currentUser.password
      );

      if (!passwordValid) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña actual no es correcta.',
        });
        return;
      }

      const { name, email } = this.profileForm.value;
      const changes = {
        ...(name.trim() && name !== this.currentUser.name && { name }),
        ...(email.trim() && email !== this.currentUser.email && { email }),
      };

      if (Object.keys(changes).length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin cambios',
          text: 'No hay cambios que guardar.',
        });
        return;
      }

      this.userService.updateUser({ ...this.currentUser, ...changes }).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Datos de perfil actualizados correctamente.',
          });
          this.currentUserService.setUsuario(this.userid!);
          this.profileForm.reset();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar los datos del perfil. Intente nuevamente.',
          });
        },
      });
    }
  }

  async onPasswordSubmit() {
    if (this.passwordForm.valid && this.currentUser) {
      const passwordValid = await this.verifyPassword(
        this.passwordForm.value.currentPassword,
        this.currentUser.password
      );

      if (!passwordValid) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña actual no es correcta.',
        });
        return;
      }

      if (!this.passwordsMatch()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las nuevas contraseñas no coinciden.',
        });
        return;
      }

      try {
        const encryptedPassword = await this.encryptPassword(this.passwordForm.value.newPassword);
        const updatedUser: User = { ...this.currentUser, password: encryptedPassword };

        this.userService.updateUser(updatedUser).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Contraseña actualizada correctamente.',
            });
            this.passwordForm.reset();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al actualizar la contraseña. Intente nuevamente.',
            });
          },
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al procesar la nueva contraseña.',
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, completa correctamente todos los campos.',
      });
    }
  }
}