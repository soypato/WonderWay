import { CommonModule } from '@angular/common';
import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CurrentUser } from '../../services/current-user.service';
import { User } from '../../interface/user.interface';
import { InvokeFunctionExpr } from '@angular/compiler';

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

  userid : number= 0; // te trae el id de la sesion actual -- es un number
  currentUser : User | null = null; // creo var para guardar el user entero de la sesion actual



  constructor(private fb: FormBuilder,private userService : UserService) {
    // Formulario para nombre y email
    this.profileForm = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
      currentPassword: ['', [Validators.required]]
    });
    // Formulario para cambio de contraseña
    this.passwordForm = this.fb.group({
      currentPassword: [''],
      newPassword: ['', [Validators.required], [Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
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
        console.error('Error al cargar el perfil del usuario:', err);
      }
    });
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
    if (this.profileForm.valid) {
      console.log('Datos de perfil actualizados:', this.profileForm.value);
    }
  }
  onPasswordSubmit() {
    if (this.passwordForm.valid && this.passwordsMatch()) {
      console.log('Contraseña cambiada:', this.passwordForm.value);
    } else {
      console.error('Las contraseñas no coinciden');
    }
  }

}
