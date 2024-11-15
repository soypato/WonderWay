import { CommonModule } from '@angular/common';
import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CurrentUser } from '../../services/current-user.service';
import { User } from '../../interface/user.interface';
import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';

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

      const updatedUser: Partial<User> = { ...this.currentUser };

      if (
        !this.profileForm.value.email &&
        this.profileForm.value.name &&
        (this.profileForm.value.name !== this.currentUser.name)   )
      {
        updatedUser.name = this.profileForm.value.name

      }else if(
        !this.profileForm.value.name &&
        this.profileForm.value.email &&
        (this.profileForm.value.email !== this.currentUser.email)   )
        {
          updatedUser.email = this.profileForm.value.email;
        }

      else if(
        this.profileForm.value.name &&
        this.profileForm.value.email &&
        (this.profileForm.value.name !== this.currentUser.name) &&
        (this.profileForm.value.email !== this.currentUser.email)   )
      {
        updatedUser.name = this.profileForm.value.name;
        updatedUser.email = this.profileForm.value.email;
      }
      else{
        console.error('No hay cambios que guardar. O ha habido un error xd');
      }

      // Llama a updateUser en el servicio UserService
      this.userService.updateUser(updatedUser as User).subscribe({
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
    if (this.passwordForm.valid && this.currentUser) {
      // Actualiza los datos en el perfil del usuario
      const updatedUser: User = {
        ...this.currentUser,
        password: this.passwordForm.value.newPassword
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

