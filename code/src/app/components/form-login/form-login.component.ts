import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { CurrentUser } from '../../services/current-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login',
  standalone: true,
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class FormLoginComponent implements OnInit {
  loginForm: FormGroup;
  serviceUser = inject(UserService); 
  currentUser = inject(CurrentUser);
  router = inject(Router);

  constructor(private fb: FormBuilder) {
     this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Control para el correo electrónico
      password: ['', [Validators.required]]                   // para la contraseña
    });
  }

  ngOnInit(): void {}
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.verifyUser();
    } else {
      this.showError('Formulario no válido.');
    }
  }

  private verifyUser(): void {
    this.serviceUser.verificarCorreo(this.loginForm.get('email')?.value).subscribe(
      usuario => {
        if (usuario) {
          this.checkAttributes(usuario);
        } else {
          this.showError('Usuario no encontrado. Por favor, regístrese o ingrese nuevamente.');
        }
      }
    );
  }

  private checkAttributes(usuario: any): void {
    if (usuario.password === this.loginForm.get('password')?.value) {
      if(usuario.active){
        this.currentUser.setUsuario(usuario);
        this.router.navigate(['/profile']);
      } else {
        this.showError('Este usuario está deshabilitado');
      }
    } else {
      this.showError('Contraseña incorrecta');
    }
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Reintentar'
    });
  }
}
