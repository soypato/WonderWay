import { CommonModule } from '@angular/common';
import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';

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

  userService = inject(UserService);

  constructor(private fb: FormBuilder) {
    // Formulario para nombre y email
    this.profileForm = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
      currentPassword: ['', Validators.required] // contraseña actual
    });

    // Formulario para cambio de contraseña
    this.passwordForm = this.fb.group({
      currentPassword: [''],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }


  // Método para validar que las nuevas contraseñas coincidan
   passwordsMatch() {
    return this.passwordForm.get('newPassword')?.value === this.passwordForm.get('confirmPassword')?.value;
  }
   prevPasswordsMatch() {
    return this.profileForm.get('currentPassword')?.value /* === ---> esto esta incompleto */;
    // mi idea era comparalo a la contra actual, llamnado a user service
    // para que te traiga la contra guardada de la sesion actual
    // pero no se como hacer eso, ni si esta bien
  }

  ngOnInit(): void {}



onProfileSubmit() {
  if (this.profileForm.valid) {
    // Aquí enviarías los datos de nombre, email y contraseña actual para verificar
    console.log('Datos de perfil actualizados:', this.profileForm.value);
  }
}

onPasswordSubmit() {
  if (this.passwordForm.valid && this.passwordsMatch()) {
    // Aquí enviarías la nueva contraseña junto con la contraseña actual para verificar
    console.log('Contraseña cambiada:', this.passwordForm.value);
  } else {
    console.error('Las contraseñas no coinciden');
  }
}





}
