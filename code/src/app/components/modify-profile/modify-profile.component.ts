import { CommonModule } from '@angular/common';
import { Component, OnInit, booleanAttribute, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CurrentUser } from '../../services/current-user.service';
import { User } from '../../interface/user.interface';
import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';
import { environment } from '../../../environments/environments';

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
  userid: string | null = null;
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
      newPassword: ['', [Validators.required]],
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
        },
        error: (err:Error) => {
          console.log('Error al cargar el perfil del usuario:', err);
        }
      })}
  }

  async prevPasswordsMatch() {
    const enteredPassword = this.profileForm.value.currentPassword;
    let storedPassword = '';
    if( this.currentUser?.password !== undefined ){
      storedPassword = this.currentUser?.password;

      if(await this.userService.verifyPassword(enteredPassword,storedPassword) as boolean){
        return true;
      }
    }
    return false;
  }

  passwordsMatch() {
    if(this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword)
    {
      return true;
    }
    return false;
  }

  async onProfileSubmit() {
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
        console.error('No hay cambios que guardar.');
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
    this.profileForm.reset();
  }

  async onPasswordSubmit() {
    if (this.passwordForm.valid && this.currentUser) {

      const encryptedPass:any= this.userService.encryptPassword(this.passwordForm.value.newPassword);

      // Actualiza los datos en el perfil del usuario
      const updatedUser: User = {
        ...this.currentUser,
        password: encryptedPass
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
    this.passwordForm.reset();
  }
}

