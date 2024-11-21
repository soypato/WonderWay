import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  profileForm: FormGroup;
  passwordForm: FormGroup;
  userid: string | null = null;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private currentUserService: CurrentUser
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
      currentPassword: ['', [Validators.required]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.userid = this.currentUserService.getUsuario();

    if (this.userid) {
      this.userService.getUserProfile(this.userid).subscribe({
        next: (user: User) => {
          this.currentUser = user;
        },
        error: (err) => {
          console.error('Error al cargar el perfil del usuario:', err);
        },
      });
    }
  }

  async prevPasswordsMatch(): Promise<boolean> {
    if (!this.profileForm.value.currentPassword || !this.currentUser?.password) {
      return false;
    }
    return this.verifyPassword(
      this.profileForm.value.currentPassword,
      this.currentUser.password
    );
  }

  passwordsMatch(): boolean {
    return (
      this.passwordForm.value.newPassword ===
      this.passwordForm.value.confirmPassword
    );
  }
  async onProfileSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      const passwordValid = await this.prevPasswordsMatch();
  
      if (!passwordValid) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña actual no es correcta.',
        });
        return;
      }
  
      const updatedUser: Partial<User> = { ...this.currentUser };
  
      // Solo actualizamos el nombre si el campo no está vacío y es diferente al actual
      if (this.profileForm.value.name.trim() && this.profileForm.value.name !== this.currentUser.name) {
        updatedUser.name = this.profileForm.value.name;
      }
  
      // Solo actualizamos el email si el campo no está vacío y es diferente al actual
      if (this.profileForm.value.email.trim() && this.profileForm.value.email !== this.currentUser.email) {
        updatedUser.email = this.profileForm.value.email;
      }
  
      // Validación: Si no hay cambios, salimos del método
      if (!updatedUser.name && !updatedUser.email) {
        Swal.fire({
          icon: 'info',
          title: 'Sin cambios',
          text: 'No hay cambios que guardar.',
        });
        return;
      }
  
      // Realizamos la actualización en el servidor
      this.userService.updateUser(updatedUser as User).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Datos de perfil actualizados.',
          });
          this.currentUserService.setUsuario(this.userid!);
          this.profileForm.reset();
        },
        error: (err) => {
          console.error('Error al actualizar el perfil:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al actualizar los datos. Inténtalo de nuevo.',
          });
        },
      });
    }
  }
  

  async onPasswordSubmit() {
    if (this.passwordForm.valid && this.currentUser) {
      const passwordValid = await this.prevPasswordsMatch();

      if (!passwordValid) {
        console.error('La contraseña actual no es correcta.');
        return;
      }

      if (!this.passwordsMatch()) {
        console.error('Las nuevas contraseñas no coinciden.');
        return;
      }

      const updatedUser: User = {
        ...this.currentUser,
        password: this.passwordForm.value.newPassword,
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Contraseña actualizada con éxito.');
          this.passwordForm.reset();
        },
        error: (err) => {
          console.error('Error al actualizar la contraseña:', err);
        },
      });
    }
  }

  async verifyPassword(
    enteredPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    const encoder = new TextEncoder();
    const fixedKey = encoder
      .encode(environment.keyPass.padEnd(32, '0'))
      .slice(0, 32);
    const storedBuffer = Uint8Array.from(
      atob(storedPassword),
      (c) => c.charCodeAt(0)
    );
    const iv = storedBuffer.slice(0, 12);
    const encryptedData = storedBuffer.slice(12);

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
      return false;
    }
  }
}
