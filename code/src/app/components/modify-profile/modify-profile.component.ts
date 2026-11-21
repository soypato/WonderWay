
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CurrentUser } from '../../services/current-user.service';
import { User } from '../../interface/user.interface';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-modify-profile',
    imports: [ReactiveFormsModule],
    templateUrl: './modify-profile.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./modify-profile.component.css']
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

  // Verificar coincidencia entre contraseñas
  passwordsMatch(): boolean {
    const { newPassword, confirmPassword } = this.passwordForm.value;
    return newPassword === confirmPassword;
  }

  async onProfileSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      const passwordValid = await this.userService.verifyPassword(
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
      const passwordValid = await this.userService.verifyPassword(
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
        const hashedPassword = await this.userService.hashPassword(this.passwordForm.value.newPassword);
        const updatedUser: User = { ...this.currentUser, password: hashedPassword };

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