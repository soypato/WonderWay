import { CommonModule } from '@angular/common';
import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CurrentUser } from '../../services/current-user.service';
import { User } from '../../interface/user.interface';

@Component({
  selector: 'app-modify-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modify-profile.component.html',
  styleUrls: ['./modify-profile.component.css']
})
export class ModifyProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  userid: number | null = null;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService : UserService,
    private currentUserService: CurrentUser
  )
    {
    // Formulario para nombre y email
    this.profileForm = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
      currentPassword: ['', [Validators.required]]
    });
    // Formulario para cambio de contraseña
    this.passwordForm = this.fb.group({
      currentPassword: ['',[Validators.required]],
      newPassword: ['', [Validators.required], [Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.userid =  this.currentUserService.getUsuario();
    this.loadUserProfile();
  }

  loadUserProfile() {
    if(this.userid){
      this.userService.getUserProfile(this.userid).subscribe({
        next: (user:User) => {
          this.currentUser = user;
          /*
          console.log('Perfil del usuario cargado:', this.currentUser);
          // Accede al valor de password
          const userPassword = this.currentUser.password;
          //console.log('Contraseña del usuario:', userPassword);
          //ni ganan de mostrar tu contra con solo apretar f12
          // Puedes usar `userPassword` aquí como desees*/
        },
        error: (err:Error) => {
          console.log('Error al cargar el perfil del usuario:', err);
        }
      })}
  }

  // Método para validar que las nuevas contraseñas coincidan
  prevPasswordsMatch() {
    if(this.profileForm.get('currentPassword')?.value  === this.currentUser?.password  )
      {
        return true;
      }
      return false;
    }
  passwordsMatch() {
    if(this.passwordForm.get('newPassword')?.value === this.passwordForm.get('confirmPassword')?.value)
    {
      return true;
    }
    return false;
  }

  onProfileSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      // Actualiza los datos en el perfil del usuario
      const updatedUser: User = {
        ...this.currentUser,
        name: this.profileForm.value.name,
        email: this.profileForm.value.email
      };

      // Llama a updateUser en el servicio UserService
      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Datos de perfil actualizados:', updatedUser);
          // Llama a setUsuario para guardar el ID del usuario en el local storage
          this.currentUserService.setUsuario(this.userid!);
        },
        error: (err:Error) => {
          console.error('Error al actualizar el perfil del usuario:', err);
        }
      });
    }
  }

  onPasswordSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      // Actualiza los datos en el perfil del usuario
      const updatedUser: User = {
        ...this.currentUser,
        password: this.profileForm.value.password
      };

      // Llama a updateUser en el servicio UserService
      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Datos de perfil actualizados:', updatedUser);
          // Llama a setUsuario para guardar el ID del usuario en el local storage
          this.currentUserService.setUsuario(this.userid!);
        },
        error: (err:Error) => {
          console.error('Error al actualizar el perfil del usuario:', err);
        }
      });
    }
  }

}





/*
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { CurrentUser } from 'app/services/current-user.service';
import { User } from 'app/models/user.model';

@Component({
  selector: 'app-modify-profile',
  templateUrl: './modify-profile.component.html',
  styleUrls: ['./modify-profile.component.css']
})
export class ModifyProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  userid: number | null = null;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private currentUserService: CurrentUser
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
      currentPassword: ['', [Validators.required]]
    });
    this.passwordForm = this.fb.group({
      currentPassword: [''],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.userid = this.currentUserService.getUsuario();
    if (this.userid !== null) {
      this.loadUserProfile();
    } else {
      console.error('No se pudo obtener el ID del usuario actual');
    }
  }

  loadUserProfile() {
    if (this.userid) {
      this.userService.getUserProfile(this.userid).subscribe({
        next: (user: User) => {
          this.currentUser = user;
          this.profileForm.patchValue({
            name: user.name,
            email: user.email
          });
        },
        error: (err: Error) => {
          console.error('Error al cargar el perfil del usuario:', err);
        }
      });
    }
  }

  onProfileSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      // Actualiza los datos en el perfil del usuario
      const updatedUser: User = {
        ...this.currentUser,
        name: this.profileForm.value.name,
        email: this.profileForm.value.email
      };

      // Llama a updateUser en el servicio UserService
      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Datos de perfil actualizados:', updatedUser);

          // Llama a setUsuario para guardar el ID del usuario en el local storage
          this.currentUserService.setUsuario(this.userid!);
        },
        error: (err) => {
          console.error('Error al actualizar el perfil del usuario:', err);
        }
      });
    }
  }
}


*/
