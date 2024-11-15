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

  usuarioActual = inject(CurrentUser).getUsuario();


  constructor(private fb: FormBuilder) {
    // Formulario para nombre y email
    this.profileForm = this.fb.group({
      name: [''],
      email: ['', [Validators.email]],
      currentPassword: ['', [Validators.required]] // contraseña actual
    });

    // Formulario para cambio de contraseña
    this.passwordForm = this.fb.group({
      currentPassword: [''],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }
  // Método para validar que las nuevas contraseñas coincidan
  prevPasswordsMatch() {
    if(this.profileForm.get('currentPassword')?.value === this.usuarioActual.password)
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

  ngOnInit(): void {}

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
