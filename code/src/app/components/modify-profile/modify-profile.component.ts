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


  /**
  modifyProfileForm: FormGroup;

  constructor(private fb: FormBuilder) {
     this.modifyProfileForm = this.fb.group({
      name: [''], // Cambia 'nombre' a 'name' para ser consistente
      email: ['', [Validators.email]],
      newPass: ['', [Validators.required , Validators.minLength(8)]],
      confirmNewPass: ['', Validators.required]
    },{ validators: ModifyProfileComponent.passwordMatchValidator });
  }

  ngOnInit(): void {}

  static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPass');
    const confirmNewPass = control.get('confirmNewPass');

    if (!newPass || !confirmNewPass) {
      return null;
    }

    return newPass.value === confirmNewPass.value ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.modifyProfileForm.valid) {
      console.log('Formulario enviado', this.modifyProfileForm.value);
      // Lógica adicional para enviar el formulario
    } else {
      console.log('Formulario no válido');
    }
  }

 */






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
      currentPassword: ['', Validators.required],
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
    const { name, email, currentPasswordForProfile } = this.profileForm.value;

    // Verifica que al menos uno de los dos campos esté completado
    if ((name || email) && currentPasswordForProfile) {
      // Procede con el envío del formulario si todo está bien
      // Es posible que aca tenga que llamar a prevpassmatch o algo asi
      console.log('Datos de perfil actualizados:', this.profileForm.value);
    } else {
      console.error('Por favor, complete al menos uno de los campos de nombre o email, junto con la contraseña actual.');
    }
  }







}
