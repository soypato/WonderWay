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
  )
  {
    this.profileForm = this.fb.group({
      name: [''],
      email: ['', [  Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/)  ]  ],
      currentPassword: ['', [Validators.required]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
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

    if(!this.currentUser || !this.profileForm.valid || !this.passwordForm.valid ){
      return false;
    }




    // Llamar a verifyPassword para comparar las contraseñas

    if(  this.profileForm.valid  ){
      return Boolean (await this.verifyPassword( this.profileForm.value.currentPassword , this.currentUser.password ) );

    }else if(  this.passwordForm.valid  ){
      return Boolean ( await this.verifyPassword( this.passwordForm.value.currentPassword , this.currentUser.password ) ) ;
    }

    return false;
  }

  passwordsMatch(): boolean {

    if (  this.passwordForm.value.newPassword && this.passwordForm.value.confirmPassword  ) {
      if (  this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword  ) {
        return true;
      }
    }

    return false;
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
      try {
        // Verificar si la contraseña actual coincide
        const passwordValid = await this.prevPasswordsMatch();

        if (!passwordValid) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La contraseña actual no es correcta.',
          });
          return;
        }

        // Verificar si las nuevas contraseñas coinciden
        if (!this.passwordsMatch()) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las nuevas contraseñas no coinciden.',
          });
          return;
        }

        // Encriptar la nueva contraseña antes de enviarla
        const encryptedPassword = await this.encryptPassword(this.passwordForm.value.newPassword);

        // Preparar el objeto con los nuevos datos del usuario
        const updatedUser: User = {
          ...this.currentUser,
          password: encryptedPassword, // Asignar la contraseña encriptada
        };

        // Actualizar la contraseña en la base de datos
        this.userService.updateUser(updatedUser).subscribe({
          next: () => {
            console.log('Contraseña actualizada con éxito.');
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Contraseña actualizada correctamente.',
            });
            this.passwordForm.reset();
          },
          error: (err) => {
            console.error('Error al actualizar la contraseña:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al actualizar la contraseña. Intenta nuevamente.',
            });
          },
        });
      } catch (error) {
        console.error('Error desconocido:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al procesar la solicitud. Intenta nuevamente.',
        });
      }
    } else {
      console.warn('Formulario inválido');
      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Por favor, completa correctamente todos los campos.',
      });
    }
  }


  // TODO: PASARLA A UNA INYECCIÓN DE DEPENDENCIAS

  // verificar contraseñas mediante desencripcion
  async verifyPassword( enteredPassword: string, storedPassword: string ): Promise<boolean> {

    console.log(enteredPassword);
    console.log(storedPassword);


    const encoder = new TextEncoder();

    const fixedKey = encoder.encode(environment.keyPass.padEnd(32, '0')).slice(0, 32);

    const storedBuffer = Uint8Array.from(atob(storedPassword),(c) => c.charCodeAt(0));

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

      return (decodedPassword === enteredPassword) ;

    } catch (error) {
      console.error('Error al desencriptar la contraseña:', error);
      return false;
    }
  }



  // Método para convertir ArrayBuffer a Base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
    return btoa(binary);
  }

  // Método para encriptar contraseñas
  async encryptPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Ajusta la clave a una longitud válida (32 bytes para AES-256)
    const fixedKey = encoder.encode(environment.keyPass.padEnd(32, '0')).slice(0, 32);

    try {
      const key = await crypto.subtle.importKey(
        'raw',
        fixedKey,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      // Combina IV y datos encriptados en un solo ArrayBuffer
      const encryptedArray = new Uint8Array(encryptedData);
      const result = new Uint8Array(iv.length + encryptedArray.length);
      result.set(iv);
      result.set(encryptedArray, iv.length);

      return this.arrayBufferToBase64(result.buffer);
    } catch (error) {
      console.error('Error durante la encriptación:', error);
      throw new Error('Encriptación fallida');
    }
  }
}
